import { Args, Float, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CreateFeedInput } from './dto/createFeedInput';
import { UpdateFeedInput } from './dto/updateFeedInput';
import { Feed } from './entities/feed.entity';
import { Cache } from 'cache-manager';

import { FeedService } from './feed.service';
import { CACHE_MANAGER, Inject } from '@nestjs/common';

@Resolver()
export class FeedResolver {
  constructor(
    private readonly feedService: FeedService,
    @Inject(CACHE_MANAGER)
    private readonly cachManager: Cache,
  ) {}

  @Query(() => Feed) // 피드 아이디로 피드 내용 조회
  async fetchFeed(
    @Args('feedId')
    feedId: string,
  ) {
    const exist = await this.cachManager.get(feedId); // 키 자체가 토큰 값이 되있기 때문.
    console.log(exist, 'redis');
    if (exist) return exist;
    else {
      const result = await this.feedService.findWithFeedId({ feedId });
      await this.cachManager.set(feedId, result, { ttl: 900 });
      console.log('db에서 서치한 데이터');
      return result;
    }
  }

  @Query(() => [Feed]) // 지역정보로 피드 조회
  fetchFeedsWithRegion(
    @Args('regionId')
    regionId: string,
  ) {
    return this.feedService.findWithRegion({ regionId });
  }

  @Query(() => [Feed]) // 태그들로 피드 조회
  fetchFeedsWithTags(
    @Args({ name: 'feedTags', type: () => [String] })
    feedTags: string[],
    @Args('regionId')
    regionId: string,
  ) {
    return this.feedService.findWithTags({ feedTags, regionId });
  }

  @Query(() => [Feed]) // 유저 정보로 피드 조회
  fetchFeedsWithUser(
    @Args('userId')
    userId: string, // currentUser payload 로 대체 예정
  ) {
    return this.feedService.findWithUser({ userId });
  }

  @Mutation(() => Boolean) // 좋아요 누르기
  toggleLikeFeed(
    @Args('userId')
    userId: string, // currentUser payload 로 대체 예정
    @Args('feedId')
    feedId: string,
  ) {
    return this.feedService.like({ userId, feedId });
  }

  @Mutation(() => Feed) // 피드 생성
  createFeed(
    @Args('createFeedInput')
    createFeedInput: CreateFeedInput,
    @Args('userId')
    userId: string, // currentUser payload 로 대체 예정
  ) {
    return this.feedService.create({ createFeedInput, userId });
  }

  @Mutation(() => Feed) // 피드 업데이트
  updateFeed(
    @Args('updateFeedInput')
    updateFeedInput: UpdateFeedInput,
    @Args('feedId')
    feedId: string, //// currentUser payload 로 대체 예정
  ) {
    return this.feedService.update({ feedId, updateFeedInput });
  }

  @Mutation(() => Boolean) // 피드 삭제
  deleteFeed(@Args('feedId') feedId: string) {
    return this.feedService.delete({ feedId });
  }
}
