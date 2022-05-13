import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateFeedInput } from './dto/createFeedInput';
import { UpdateFeedInput } from './dto/updateFeedInput';
import { Feed } from './entities/feed.entity';
import { FeedService } from './feed.service';

@Resolver()
export class FeedResolver {
  constructor(private readonly feedService: FeedService) {}

  @Query(() => Feed)
  fetchFeed(
    @Args('feedId')
    feedId: string,
  ) {
    return this.feedService.findWithId({ feedId });
  }

  @Query(() => [Feed])
  fetchFeedsWithTags(
    @Args({ name: 'feedTags', type: () => [String] })
    feedTags: string[],
  ) {
    return this.feedService.findWithTags({ feedTags });
  }

  // @Query(() => Feed)
  // fetchFeedsWithUser() {}

  // @Mutation(() => Number)

  @Mutation(() => Feed)
  createFeed(
    @Args('createFeedInput')
    createFeedInput: CreateFeedInput,
  ) {
    return this.feedService.create({ createFeedInput });
  }

  @Mutation(() => Feed)
  updateFeed(
    @Args('updateFeedInput')
    updateFeedInput: UpdateFeedInput,
    @Args('feedId')
    feedId: string,
  ) {
    return this.feedService.update({ feedId, updateFeedInput });
  }

  @Mutation(() => Boolean)
  deleteFeed(@Args('feedId') feedId: string) {
    return this.feedService.delete({ feedId });
  }
}
