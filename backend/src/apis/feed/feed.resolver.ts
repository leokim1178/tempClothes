import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/commons/auth/gql-user.param';
import { CreateFeedInput } from './dto/createFeedInput';
import { UpdateFeedInput } from './dto/updateFeedInput';
import { Feed } from './entities/feed.entity';
import { FeedService } from './feed.service';

@Resolver()
export class FeedResolver {
  constructor(private readonly feedService: FeedService) {}

  @Query(() => Feed) // 피드 아이디로 피드 내용 조회
  fetchFeed(
    @Args('feedId')
    feedId: string,
  ) {
    return this.feedService.findWithFeedId({ feedId });
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
