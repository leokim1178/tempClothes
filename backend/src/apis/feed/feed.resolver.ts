import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateFeedInput } from './dto/createFeed.input';
import { UpdateFeedInput } from './dto/updateFeed.input';
import { Feed } from './entities/feed.entity';
import { Cache } from 'cache-manager';
import { FeedService } from './feed.service';
import { CACHE_MANAGER, Inject, UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth-guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { fetchFeedOutput } from './dto/fetchFeed.output';

/**
 * Feed GraphQL API Resolver
 * @APIs `fetchFeed`, `fetchFeeds`, `fetchMyFeeds`, `fetchUserFeeds`,
 * `createFeed`, `updateFeed`, `deleteFeed`
 */

@Resolver()
export class FeedResolver {
  constructor(
    private readonly feedService: FeedService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * Fetch certain Feed API
   * @type [`Query`]
   * @param feedId ID of Feed
   * @returns `Feed`
   */
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Feed)
  async fetchFeed(
    @Args('feedId')
    feedId: string,
  ) {
    const result: Feed = await this.feedService.findWithFeedId({ feedId });

    return result;
  }

  /**
   * Fetch certain Feed API
   * @type [`Query`]
   * @param region ID of Region
   * @param feedTags tagName[] of FeedTag
   * @param page[optional] page number of fetchFeedOutput
   * @returns `fetchFeedOutput`
   */
  @Query(() => fetchFeedOutput)
  async fetchFeeds(
    @Args('regionId')
    regionId: string,
    @Args({ name: 'feedTags', type: () => [String], nullable: true })
    feedTags: string[],
    @Args({ name: 'page', nullable: true, type: () => Int })
    page?: number,
  ) {
    const region = await this.feedService.checkExist({ regionId });
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
        await this.cacheManager.set(redisInput, result, { ttl: 5 });
        return result;
      }
    } catch ({ error, region }) {
      const result: fetchFeedOutput = await this.feedService.findWithTags({
        feedTags,
        region,
        page,
      });

      return result;
    }
  }

  /**
   * Fetch certain Feed API
   * @type [`Query`]
   * @param page[optional] page number of fetchFeedOutput
   * @returns `fetchFeedOutput`
   */

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

  /**
   * Fetch certain Feed API
   * @type [`Query`]
   * @param userNickname nickname of the User
   * @param page[optional] page number of fetchFeedOutput
   * @returns `fetchFeedOutput`
   */
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
  /**
   * Create Feed API
   * @type [`Mutation`]
   * @param createFeedInput input type of createFeed
   * @returns `Feed`
   */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Feed)
  createFeed(
    @Args('createFeedInput')
    createFeedInput: CreateFeedInput,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.feedService.create({ createFeedInput, currentUser });
  }
  /**
   * Update Feed API
   * @type [`Mutation`]
   * @param createFeedInput input type of updateFeed
   * @returns `Feed`
   */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Feed)
  async updateFeed(
    @Args('updateFeedInput')
    updateFeedInput: UpdateFeedInput,
    @Args('feedId')
    feedId: string,
  ) {
    const feed = await this.feedService.checkExist({ feedId });
    return this.feedService.update({ feed, updateFeedInput });
  }
  /**
   * Delete Feed API
   * @type [`Mutation`]
   * @param createFeedInput input type of updateFeed
   * @returns delete result(`true`, `false`)
   */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteFeed(@Args('feedId') feedId: string) {
    const feed = await this.feedService.checkExist({ feedId });
    return this.feedService.delete({ feed });
  }
}
