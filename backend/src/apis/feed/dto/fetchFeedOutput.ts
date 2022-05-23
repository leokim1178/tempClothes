import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Feed } from '../entities/feed.entity';

@ObjectType()
export class fetchFeedOutput {
  @Field(() => [Feed])
  feeds: Feed[];

  @Field(() => Int)
  total: number;

  @Field(() => Int, { nullable: true })
  count?: number;

  @Field(() => Int, { nullable: true })
  page?: number;
}
