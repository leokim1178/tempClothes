import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateFeedInput {
  @Field(() => String)
  detail: string;

  @Field(() => String)
  regionName: string;

  @Field(() => [String])
  feedTag: string[];
}
