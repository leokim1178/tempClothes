import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, In, Repository } from 'typeorm';
import { FeedTag } from '../feedTag/entities/feedTag.entity';
import { Region } from '../region/entities/region.entity';
import { User } from '../user/entities/user.entity';
import { Feed } from './entities/feed.entity';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
    @InjectRepository(FeedTag)
    private readonly feedTagRepository: Repository<FeedTag>,
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findWithTags({ feedTags, regionId }) {
    const result = await this.feedRepository
      .createQueryBuilder('Feed')
      .leftJoinAndSelect('Feed.region', 'region')
      .where({ region: regionId })
      .leftJoinAndSelect('Feed.feedTag', 'feedTag')
      .andWhere('feedTag.tagname IN (:tagName)', {
        tagName: feedTags,
      })
      .orderBy('Feed.watchCount', 'DESC')
      .getMany();

    return result;
  }

  async findWithUser({ userId }) {
    const result = await this.feedRepository.find({
      where: {
        user: userId,
      },
      order: { watchCount: 'DESC' },
    });
    return result;
  }

  async findWithFeedId({ feedId }) {
    const findFeed = await this.feedRepository.findOne({
      id: feedId,
    });
    const result = await this.feedRepository.save({
      ...findFeed,
      watchCount: findFeed.watchCount + 1,
    });

    return result;
  }

  async create({ createFeedInput, userId }) {
    const { feedTag, regionId, ...feed } = createFeedInput;
    const tagResult = [];
    for (let i = 0; i < feedTag.length; i++) {
      const tagName = feedTag[i];
      const prevTag = await this.feedTagRepository.findOne({
        where: { tagName },
      });
      if (prevTag) {
        tagResult.push(prevTag);
      } else {
        const newTag = await this.feedTagRepository.save({
          tagName,
        });
        tagResult.push(newTag);
      }
    }
    const region = await this.regionRepository.save({
      id: regionId,
      location_name: regionId,
    });
    console.log(region);
    const user = await this.userRepository.findOne({ where: { userId } });
    const feedSaveResult = await this.feedRepository.save({
      ...feed,
      region: region,
      feedTag: tagResult,
      user,
    });

    return feedSaveResult;
  }
  async update({ feedId, updateFeedInput }) {
    const lastFeed = await this.feedRepository.findOne({
      where: {
        id: feedId,
      },
    });

    const { feedTag, regionId, ...feed } = updateFeedInput;
    const tagResult = [];

    for (let i = 0; i < feedTag.length; i++) {
      const tagName = feedTag[i];
      const prevTag = await this.feedTagRepository.findOne({
        where: { tagName },
      });
      if (prevTag) {
        tagResult.push(prevTag);
      } else {
        const newTag = await this.feedTagRepository.save({
          tagName,
        });
        tagResult.push(newTag);
      }
    }
    const region = await this.regionRepository.findOne({
      where: { id: regionId },
    });
    const feedUpdateResult = await this.feedRepository.save({
      ...lastFeed,
      ...feed,
      region: region,
      feedTag: tagResult,
    });
    return feedUpdateResult;
  }

  async delete({ feedId }) {
    const feed = await this.feedRepository.findOne({ id: feedId });
    if (!feed) throw new ConflictException('존재하지 않는 피드입니다');
    const result = await this.feedRepository.delete({ id: feedId });
    return result.affected ? true : false;
  }
}
