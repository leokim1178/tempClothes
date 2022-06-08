import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateFeedInput } from './dto/createFeedInput';
import { UpdateFeedInput } from './dto/updateFeedInput';
import { Feed } from './entities/feed.entity';
import { Cache } from 'cache-manager';
import { FeedService } from './feed.service';
import { CACHE_MANAGER, Inject, UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth-guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { fetchFeedOutput } from './dto/fetchFeedOutput';

@Resolver()
export class FeedResolver {
  constructor(
    private readonly feedService: FeedService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Feed)
  async fetchFeed(
    @Args('feedId')
    feedId: string,
  ) {
    const result: Feed = await this.feedService.findWithFeedId({ feedId });

    return result;
  }

  @Query(() => fetchFeedOutput)
  async fetchFeeds(
    @Args('regionId')
    region: string,
    @Args({ name: 'feedTags', type: () => [String], nullable: true })
    feedTags: string[],
    @Args({ name: 'page', nullable: true, type: () => Int })
    page?: number,
  ) {
    try {
      const redisInput = JSON.stringify({ region, feedTags, page });
      const redis = await this.cacheManager.get(redisInput);
      if (redis) {
        return redis;
      } else {
        const result: fetchFeedOutput = await this.feedService.findWithTags({
          feedTags,
          region,
          page,
        });
        await this.cacheManager.set(redisInput, result, { ttl: 10 });
        return result;
      }
    } catch (error) {
      const result: fetchFeedOutput = await this.feedService.findWithTags({
        feedTags,
        region,
        page,
      });

      return result;
    }
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => fetchFeedOutput)
  async fetchMyFeeds(
    @CurrentUser() currentUser: ICurrentUser,
    @Args({ name: 'page', nullable: true, type: () => Int })
    page?: number,
  ) {
    try {
      const redisInput = JSON.stringify({ currentUser, page });
      const redis = await this.cacheManager.get(redisInput);
      if (redis) {
        return redis;
      } else {
        const result: fetchFeedOutput = await this.feedService.findMyFeeds({
          currentUser,
          page,
        });
        await this.cacheManager.set(redisInput, result, { ttl: 10 });
        return result;
      }
    } catch (error) {
      const result: fetchFeedOutput = await this.feedService.findMyFeeds({
        currentUser,
        page,
      });

      return result;
    }
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => fetchFeedOutput)
  async fetchUserFeeds(
    @Args('userNickname')
    userNickname: string,
    @Args({ name: 'page', nullable: true, type: () => Int })
    page?: number,
  ) {
    try {
      const redisInput = JSON.stringify({ userNickname, page });
      const redis: fetchFeedOutput = await this.cacheManager.get(redisInput);
      if (redis) {
        return redis;
      } else {
        const result: fetchFeedOutput = await this.feedService.findUserFeeds({
          userNickname,
          page,
        });
        await this.cacheManager.set(redisInput, result, { ttl: 3 });
        return result;
      }
    } catch (error) {
      const result: fetchFeedOutput = await this.feedService.findUserFeeds({
        userNickname,
        page,
      });

      return result;
    }
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Feed)
  createFeed(
    @Args('createFeedInput')
    createFeedInput: CreateFeedInput,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.feedService.create({ createFeedInput, currentUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Feed)
  updateFeed(
    @Args('updateFeedInput')
    updateFeedInput: UpdateFeedInput,
    @Args('feedId')
    feedId: string,
  ) {
    return this.feedService.update({ feedId, updateFeedInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteFeed(@Args('feedId') feedId: string) {
    return this.feedService.delete({ feedId });
  }
}
