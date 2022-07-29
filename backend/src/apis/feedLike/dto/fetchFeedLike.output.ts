import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class fetchFeedLikeOutput {
  @Field(() => Int)
  likeCount: number;

  @Field(() => Boolean)
  isLike: boolean;

  @Field(() => String)
  nickname: string;
}
