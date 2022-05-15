import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth-guard';
import { CurrentUser } from 'src/commons/auth/gql-user.param';
import { CommentService } from './comment.service';
import { createCommentInput } from './dto/createComment.input';
import { Comment } from './entities/comment.entity';
import { updateCommentInput } from './dto/updateComment.input';

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
    @Args('userId') userId: string, //
    @Args('createCommentInput') createCommentInput: createCommentInput,
  ) {
    return this.commentService.create({ userId, createCommentInput });
  }

  // @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Comment)
  updateComment(
    // @CurrentUser() currentUser: any, // 로그인 구현 되면 열기
    @Args('userId') userId: string,
    @Args('commentId') commentId: string,
    @Args('updateCommentInput') updateCommentInput: updateCommentInput,
  ) {
    return this.commentService.update({
      commentId,
      userId,
      updateCommentInput,
    });
  }

  // @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteComment(
    @Args('commentId') commentId: string, //
  ) {
    return this.commentService.delete({ commentId }); // feedId 추가해야함
  }
}
