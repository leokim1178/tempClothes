import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../comment/entities/comment.entity';
import { CommentResolver } from '../comment/comment.resolver';
import { CommentService } from '../comment/comment.service';
import { Feed } from '../feed/entities/feed.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Feed, User])],
  providers: [CommentResolver, CommentService],
})
export class CommentModule {}
