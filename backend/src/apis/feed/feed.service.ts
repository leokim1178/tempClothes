import { Injectable } from '@nestjs/common';
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
        const newTag = await this.feedTagRepository.save({ tagName });
        tagResult.push(newTag);
      }
    }
    return await this.feedRepository.save({
      ...feed,
      region: { id: regionId },
      feedTags: tagResult,
    });
  }
}
