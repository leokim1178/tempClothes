import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class createCommentInput {
  @Field(() => String, { nullable: true })
  pCommentId: string;

  @Field(() => String)
  commentDetail: string;

  @Field(() => String)
  feedId: string;
}
