import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feed } from '../feed/entities/feed.entity';
import { FeedImg } from '../feedImg/entities/feedImg.entity';
import { FeedTag } from '../feedTag/entities/feedTag.entity';
import { User } from '../user/entities/user.entity';
import { CronService } from './cron.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedImg, User, Feed, FeedTag]),
    ScheduleModule.forRoot(),
  ],
  providers: [CronService],
})
export class CronModule {}
