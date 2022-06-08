import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Comment } from '../entities/comment.entity';

@ObjectType()
export class fetchCommentOutput {
  @Field(() => [Comment])
  comments: Comment[];

  @Field(() => Int, { nullable: true })
  page?: number;
}
