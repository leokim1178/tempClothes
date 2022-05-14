import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feed } from '../feed/entities/feed.entity';
import { FeedImg } from './entities/feedImg.entity';
import { FeedImgResolver } from './feedImg.resolver';
import { FeedImgService } from './feedImg.service';

@Module({
  imports: [TypeOrmModule.forFeature([FeedImg, Feed])],
  providers: [FeedImgResolver, FeedImgService],
})
export class FeedImgModule {}
