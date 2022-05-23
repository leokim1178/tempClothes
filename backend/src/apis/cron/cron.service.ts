import { Storage } from '@google-cloud/storage';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { FeedImg } from '../feedImg/entities/feedImg.entity';

@Injectable()
export class CronService {
  constructor(
    private schedularRegistry: SchedulerRegistry,
    @InjectRepository(FeedImg)
    private readonly feedImgRepository: Repository<FeedImg>,
  ) {}
  private readonly logger = new Logger(CronService.name);

  // @Cron('0 0 0 * * *')
  @Cron('0 0 0 * * *')
  async cleanImgBucket() {
    const storage = new Storage({
      keyFilename: process.env.STORAGE_KEY_FILENAME,
      projectId: process.env.STORAGE_PROJECT_ID,
    }).bucket(process.env.STORAGE_BUCKET);
    const bucket = process.env.STORAGE_BUCKET;
    const getFiles = await storage.getFiles();

    const storageURLs = await Promise.all(getFiles[0].map((el) => el.name));
    const dbImgs = await this.feedImgRepository.find();
    const dbImgURLs = dbImgs.map((el) => el.imgURL);

    console.log(storageURLs);
    console.log(dbImgURLs);
    await Promise.all(
      storageURLs.map((el) => {
        return new Promise((resolve, reject) => {
          if (!dbImgURLs.includes(`${bucket}/${el}`)) storage.file(el).delete();
        });
      }),
    );
    this.logger.debug('이미지 스토리지 청소 완료!!');
  }
}
