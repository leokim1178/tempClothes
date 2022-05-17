import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { Region } from '../region/entities/region.entity';
import { FeedService } from '../feed/feed.service';
import { Feed } from '../feed/entities/feed.entity';
import { FeedTag } from '../feedTag/entities/feedTag.entity';
import { FeedImg } from '../feedImg/entities/feedImg.entity';
import { Comment } from '../comment/entities/comment.entity';
import { FeedLike } from '../feedLike/entities/feedLike.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Region,
      Feed,
      FeedTag,
      FeedImg,
      Comment,
      FeedLike,
    ]),
  ],
  providers: [UserResolver, UserService, FeedService],
})
export class UserModule {}
