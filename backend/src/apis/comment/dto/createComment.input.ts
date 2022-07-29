import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field(() => String, { nullable: true })
  pCommentId: string;

  @Field(() => String)
  commentDetail: string;

  @Field(() => String)
  feedId: string;
}
