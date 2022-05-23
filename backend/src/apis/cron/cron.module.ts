import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedImg } from '../feedImg/entities/feedImg.entity';
import { CronService } from './cron.service';

@Module({
  imports: [TypeOrmModule.forFeature([FeedImg]), ScheduleModule.forRoot()],
  providers: [CronService],
})
export class CronModule {}
