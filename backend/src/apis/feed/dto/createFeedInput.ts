import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateFeedInput {
  @Field(() => String)
  detail: string;

  @Field(() => String)
  regionId: string;

  @Field(() => [String])
  feedTag: string[];

  @Field(() => String, { nullable: true })
  top: string;

  @Field(() => String, { nullable: true })
  bottom: string;

  @Field(() => String, { nullable: true })
  outer: string;
}
