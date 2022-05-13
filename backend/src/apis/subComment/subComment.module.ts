import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubComment } from '../subComment/entities/subComment.entity';
import { SubCommentResolver } from '../subComment/subComment.resolver';
import { SubCommentService } from '../subComment/subComment.service';
import { Comment } from '../comment/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubComment, Comment])],
  providers: [SubCommentResolver, SubCommentService],
})
export class SubCommentModule {}
