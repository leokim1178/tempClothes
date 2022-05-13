import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedTag } from '../feedTag/entities/feedTag.entity';
import { Feed } from './entities/feed.entity';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
    @InjectRepository(FeedTag)
    private readonly feedTagRepository: Repository<FeedTag>,
  ) {}

  async findWithTags({ feedTags }) {
    const feedResult = [];
    for (let i = 0; i < feedTags.length; i++) {
      const lastTag = await this.feedTagRepository.findOne({
        where: { tagName: feedTags[i] },
        relations: ['feeds'],
      });

      const checkFeed = lastTag.feeds;
      feedResult.push(checkFeed);
    }

    const finalResult = [...new Set(feedResult.flat())].sort((a, b) => {
      return b.watchCount - a.watchCount;
    });

    return finalResult;
  }

  async findWithId({ feedId }) {
    const findFeed = await this.feedRepository.findOne({
      id: feedId,
    });
    const result = await this.feedRepository.save({
      ...findFeed,
      watchCount: findFeed.watchCount + 1,
    });

    return result;
  }

  async create({ createFeedInput }) {
    const { feedTags, regionId, ...feed } = createFeedInput;
    const tagResult = [];
    for (let i = 0; i < feedTags.length; i++) {
      const tagName = feedTags[i];
      const prevTag = await this.feedTagRepository.findOne({
        where: { tagName },
      });
      if (prevTag) {
        tagResult.push(prevTag);
      } else {
        const newTag = await this.feedTagRepository.save({
          tagName,
          feeds: [],
        });
        tagResult.push(newTag);
      }
    }
    const feedSaveResult = await this.feedRepository.save({
      ...feed,
      region: { id: regionId },
      feedTags: tagResult,
    });

    return feedSaveResult;
  }
  async update({ feedId, updateFeedInput }) {
    const lastFeed = await this.feedRepository.findOne({
      where: {
        id: feedId,
      },
    });
    const { feedTags, regionId, ...feed } = updateFeedInput;
    const tagResult = [];
    for (let i = 0; i < feedTags.length; i++) {
      const tagName = feedTags[i];
      const prevTag = await this.feedTagRepository.findOne({
        where: { tagName },
      });
      if (prevTag) {
        tagResult.push(prevTag);
      } else {
        const newTag = await this.feedTagRepository.save({
          tagName,
          feeds: [],
        });
        tagResult.push(newTag);
      }
    }
    const feedUpdateResult = await this.feedRepository.save({
      ...lastFeed,
      ...feed,
      region: { id: regionId },
      feedTags: tagResult,
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
