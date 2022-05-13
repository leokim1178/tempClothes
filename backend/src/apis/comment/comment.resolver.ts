import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth-guard';
import { CurrentUser } from 'src/commons/auth/gql-user.param';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';

@Resolver()
export class CommentResolver {
  constructor(
    private readonly commentService: CommentService, //
  ) {}

  @Query(() => Comment)
  fetchComment(@Args('feedId') feedId: string) {
    return this.commentService.findOne({ feedId });
  }

  // @UseGuards(GqlAuthAccessGuard) // 로그인한 유저 댓글 가능
  @Mutation(() => Comment)
  createComment(
    // @CurrentUser() currentUser: any, // 로그인 구현 되면 열기
    @Args('mainDetail') mainDetail: string, //
    @Args('feedId') feedId: string,
    @Args('userId') userId: string,
  ) {
    return this.commentService.create({ mainDetail, feedId, userId });
  }

  // @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Comment)
  updateComment(
    // @CurrentUser() currentUser: any, // 로그인 구현 되면 열기
    @Args('userId') userId: string,
    @Args('mainDetail') mainDetail: string,
    @Args('commentId') commentId: string,
  ) {
    return this.commentService.update({ mainDetail, commentId, userId });
  }

  // @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteComment(
    @Args('commentId') commentId: string,
    @Args('userId') userId: string,
  ) {
    return this.commentService.delete({ userId, commentId }); // feedId 추가해야함
  }
}
