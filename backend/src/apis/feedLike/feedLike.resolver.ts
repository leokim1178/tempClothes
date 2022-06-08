import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth-guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { fetchFeedLikeOutput } from './dto/fetchFeedLikeOutPut';
import { FeedLikeService } from './feedLike.service';

@Resolver()
export class FeedLikeResolver {
  constructor(private readonly feedLikeService: FeedLikeService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => fetchFeedLikeOutput)
  fetchFeedLike(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('feedId')
    feedId: string,
  ) {
    return this.feedLikeService.find({ currentUser, feedId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  toggleLikeFeed(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('feedId')
    feedId: string,
  ) {
    return this.feedLikeService.like({ currentUser, feedId });
  }
}
