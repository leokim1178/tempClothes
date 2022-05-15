import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, In, Repository } from 'typeorm';
import { FeedImg } from '../feedImg/entities/feedImg.entity';
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
    @InjectRepository(FeedImg)
    private readonly feedImgRepository: Repository<FeedImg>,
  ) {}

  async findWithRegion({ regionId }) {
    const result = await this.feedRepository
      .createQueryBuilder('Feed')
      .leftJoinAndSelect('Feed.region', 'region')
      .where({ region: regionId })
      .leftJoinAndSelect('Feed.feedTag', 'feedTag')
      .leftJoinAndSelect('Feed.feedImg', 'feedImg')
      .orderBy('Feed.watchCount', 'DESC')
      .getMany();

    return result;
  }

  async findWithTags({ feedTags, regionId }) {
    const result = await this.feedRepository
      .createQueryBuilder('Feed')
      .leftJoinAndSelect('Feed.region', 'region')
      .where({ region: regionId })
      .leftJoinAndSelect('Feed.feedTag', 'feedTag')
      .andWhere('feedTag.tagName IN (:tagName)', {
        tagName: feedTags,
      })
      .leftJoinAndSelect('Feed.feedImg', 'feedImg')
      .orderBy('Feed.watchCount', 'DESC')
      .getMany();

    return result;
  }

  async findWithUser({ userId }) {
    const result = await this.feedRepository
      .createQueryBuilder('Feed')
      .leftJoinAndSelect('Feed.user', 'user')
      .where({ user: userId })
      .leftJoinAndSelect('Feed.feedImg', 'feedImg')
      .orderBy('Feed.watchCount', 'DESC')
      .getMany();
    console.log(result);

    return result;
  }

  async findWithFeedId({ feedId }) {
    const feed = await this.feedRepository
      .createQueryBuilder('Feed')
      .where({ id: feedId })
      .leftJoinAndSelect('Feed.feedImg', 'feedImg')
      .getOne();
    const result = await this.feedRepository.save({
      ...feed,
      watchCount: feed.watchCount + 1,
    });

    return result;
  }

  async create({ userId, createFeedInput }) {
    const { feedTag, regionName, ...feed } = createFeedInput;

    const region = await this.regionRepository.findOne({
      name: regionName,
    });
    if (!region) throw new ConflictException('등록되지 않은 지역명입니다');

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
    if (!lastFeed) throw new ConflictException('등록되지 않은 피드입니다 ');

    const { feedTag, regionName, ...feed } = updateFeedInput;
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
      where: { name: regionName },
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
    const imgs = await this.feedImgRepository.find({ where: { feed: feedId } });

    await Promise.all(
      imgs.map((el) => {
        this.feedImgRepository.delete({ id: el.id });
      }),
    );

    const result = await this.feedRepository.delete({ id: feedId });
    return result.affected ? true : false;
  }
}
