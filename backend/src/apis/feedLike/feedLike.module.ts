import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feed } from '../feed/entities/feed.entity';
import { User } from '../user/entities/user.entity';
import { FeedLike } from './entities/feedLike.entity';
import { FeedLikeResolver } from './feedLike.resolver';
import { FeedLikeService } from './feedLike.service';

@Module({
  imports: [TypeOrmModule.forFeature([Feed, User, FeedLike])],
  providers: [FeedLikeResolver, FeedLikeService],
})
export class FeedLikeModule {}
