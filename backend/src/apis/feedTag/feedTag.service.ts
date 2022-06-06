import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedTag } from './entities/feedTag.entity';

@Injectable()
export class FeedTagService {
  constructor(
    @InjectRepository(FeedTag)
    private readonly feedTagRepository: Repository<FeedTag>,
  ) {}

  async find({ count }) {
    const result = await this.feedTagRepository
      .createQueryBuilder('FeedTag')
      .leftJoinAndSelect('FeedTag.feed', 'feed')
      .leftJoinAndSelect('feed.feedImg', 'imgs')
      .orderBy('FeedTag.count', 'DESC')
      .take(count)
      .getMany();

    return result;
  }
}
