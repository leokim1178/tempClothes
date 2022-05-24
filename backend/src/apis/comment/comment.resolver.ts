import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth-guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { CommentService } from './comment.service';
import { createCommentInput } from './dto/createComment.input';
import { Comment } from './entities/comment.entity';
import { updateCommentInput } from './dto/updateComment.input';

@Resolver()
export class CommentResolver {
  constructor(
    private readonly commentService: CommentService, //
  ) {}

  @Query(() => [Comment])
  fetchComments(
    @Args('feedId') feedId: string, //
    @Args('page', { nullable: true }) page?: number, //
  ) {
    return this.commentService.findAll({ feedId });
  }

  @Query(() => [Comment])
  fetchSubComments(@Args('pCommentId') pCommentId: string) {
    return this.commentService.findSubComments({ pCommentId });
  }

  @UseGuards(GqlAuthAccessGuard) // 로그인한 유저 댓글 가능
  @Mutation(() => Comment)
  createComment(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('createCommentInput') createCommentInput: createCommentInput,
  ) {
    return this.commentService.create({ currentUser, createCommentInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Comment)
  updateComment(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('email') email: string,
    @Args('commentId') commentId: string,
    @Args('updateCommentInput') updateCommentInput: updateCommentInput,
  ) {
    return this.commentService.update({
      commentId,
      email,
      updateCommentInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteComment(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('commentId') commentId: string, //
  ) {
    return this.commentService.delete({ commentId }); // feedId 추가해야함
  }
}
