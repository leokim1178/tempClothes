import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/commons/auth/gql-user.param';
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
    return this.feedService.findWithFeedId({ feedId });
  }

  @Query(() => [Feed])
  fetchFeedsWithTags(
    @Args({ name: 'feedTags', type: () => [String] })
    feedTags: string[],
    @Args('regionId')
    regionId: string,
  ) {
    return this.feedService.findWithTags({ feedTags, regionId });
  }

  @Query(() => [Feed])
  fetchFeedsWithUser(
    @Args('userId')
    userId: string, // currentUser 로 대체 예정
  ) {
    return this.feedService.findWithUser({ userId });
  }

  @Mutation(() => Feed)
  createFeed(
    @Args('createFeedInput')
    createFeedInput: CreateFeedInput,
    @Args('userId')
    userId: string,
  ) {
    return this.feedService.create({ createFeedInput, userId });
  }

  @Mutation(() => Feed)
  updateFeed(
    @Args('updateFeedInput')
    updateFeedInput: UpdateFeedInput,
    @Args('feedId')
    feedId: string, //// currentUser 로 대체 예정
  ) {
    return this.feedService.update({ feedId, updateFeedInput });
  }

  @Mutation(() => Boolean)
  deleteFeed(@Args('feedId') feedId: string) {
    return this.feedService.delete({ feedId });
  }
}
