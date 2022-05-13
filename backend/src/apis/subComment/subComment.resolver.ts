import { UseGuards } from '@nestjs/common';
import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth-guard';
import { SubComment } from './entities/subComment.entity';
import { SubCommentService } from './subComment.service';

@Resolver()
export class SubCommentResolver {
  constructor(
    private readonly subCommentService: SubCommentService, //
  ) {}

  @Query(() => SubComment)
  fetchSubComment(
    @Args('commentId') commentId: string, //
  ) {
    return this.subCommentService.findOne({ commentId });
  }

  // @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => SubComment)
  createSubComment(
    // @CurrentUser() currentUser: any, // 로그인 구현 되면 열기
    @Args('subDetail') subDetail: string, //
    @Args('commentId') commentId: string,
    @Args('userId') userId: string,
  ) {
    return this.subCommentService.create({ subDetail, commentId, userId });
  }

  // @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => SubComment)
  updateSubComment(
    // @CurrentUser() currentUser: any, // 로그인 구현 되면 열기
    @Args('subCommentId') subCommentId: string,
    @Args('userId') userId: string,
    @Args('subDetail') subDetail: string,
  ) {
    return this.subCommentService.update({ subDetail, subCommentId, userId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteSubComment(
    @Args('commentId') commentId: string,
    @Args('userId') userId: string,
  ) {
    return this.subCommentService.delete({ commentId, userId });
  }
}
