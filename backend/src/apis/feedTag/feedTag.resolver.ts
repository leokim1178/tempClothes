import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { FeedTag } from './entities/feedTag.entity';
import { FeedTagService } from './feedTag.service';

@Resolver()
export class FeedTagResolver {
  constructor(private readonly feedTagService: FeedTagService) {}

  @Query(() => [FeedTag])
  fetchFeedTags(
    @Args({ name: 'count', type: () => Int })
    count: number,
  ) {
    return this.feedTagService.find({ count });
  }
}
