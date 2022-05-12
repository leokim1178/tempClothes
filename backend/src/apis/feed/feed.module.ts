import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feed } from './entities/feed.entity';
import { FeedResolver } from './feed.resolver';
import { FeedService } from './feed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Feed])],
  providers: [FeedResolver, FeedService],
})
export class FeedModule {}
