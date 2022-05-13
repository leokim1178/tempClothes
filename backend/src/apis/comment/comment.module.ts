import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../comment/entities/comment.entity';
import { CommentResolver } from '../comment/comment.resolver';
import { CommentService } from '../comment/comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  providers: [CommentResolver, CommentService],
})
export class CommentModule {}
