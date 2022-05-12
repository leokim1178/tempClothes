import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedTag } from '../feedTag/entities/feedTag.entity';
import { Feed } from './entities/feed.entity';
import { FeedResolver } from './feed.resolver';
import { FeedService } from './feed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Feed, FeedTag])],
  providers: [FeedResolver, FeedService],
})
export class FeedModule {}
