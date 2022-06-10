import { Storage } from '@google-cloud/storage';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Feed } from '../feed/entities/feed.entity';
import { FeedImg } from '../feedImg/entities/feedImg.entity';
import { FeedTag } from '../feedTag/entities/feedTag.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CronService {
  constructor(
    private schedularRegistry: SchedulerRegistry,
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
    @InjectRepository(FeedImg)
    private readonly feedImgRepository: Repository<FeedImg>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(FeedTag)
    private readonly feedTagRepository: Repository<FeedTag>,
  ) {}
  private readonly logger = new Logger(CronService.name);

  @Cron(CronExpression.EVERY_3_HOURS)
  async resetWatchCount() {
    const feeds = await this.feedRepository.find();

    await Promise.all(
      feeds.map((el) => {
        return this.feedRepository.save({ ...el, watchCount: 0 });
      }),
    );
    this.logger.debug('💥💥💥조회수 초기화 완료!💥💥💥');
  }
  @Cron(CronExpression.EVERY_6_HOURS)
  async resetFeedCount() {
    const feedTags = await this.feedTagRepository.find();

    await Promise.all(
      feedTags.map((el) => {
        return this.feedTagRepository.save({ ...el, count: 0 });
      }),
    );
    this.logger.debug('💥💥💥피드카운트 초기화 완료!💥💥💥');
  }

  @Cron(CronExpression.EVERY_WEEK)
  async cleanImgBucket() {
    const storage = new Storage({
      keyFilename: process.env.STORAGE_KEY_FILENAME,
      projectId: process.env.STORAGE_PROJECT_ID,
    }).bucket(process.env.STORAGE_BUCKET);
    const bucket = process.env.STORAGE_BUCKET;
    const getFiles = await storage.getFiles();

    const storageURLs = await Promise.all(getFiles[0].map((el) => el.name));
    const dbFeeds = await this.feedImgRepository.find();
    const dbImgURLs = dbFeeds.map((el) => el.imgURL);
    const dbUsers = await this.userRepository.find();
    const dbUserImgURLs = dbUsers.map((el) => el.userImgURL);

    await Promise.all(
      storageURLs.map((el) => {
        return new Promise((resolve, reject) => {
          if (
            !dbImgURLs.includes(`${bucket}/${el}`) &&
            !dbUserImgURLs.includes(`${bucket}/${el}`)
          )
            storage.file(el).delete();
        });
      }),
    );
    this.logger.debug('💥💥💥이미지 스토리지 청소 완료!💥💥💥');
  }
}
