import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, Int } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth-guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { CommentService } from './comment.service';
import { CreateCommentInput } from './dto/createComment.input';
import { Comment } from './entities/comment.entity';
import { UpdateCommentInput } from './dto/updateComment.input';
import { FetchCommentOutput } from './dto/fetchComment.output';

@Resolver()
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => FetchCommentOutput)
  fetchComments(
    @Args('feedId', { type: () => String }) feedId: string,
    @Args('page', { nullable: true, type: () => Int }) page?: number,
  ) {
    return this.commentService.findAll({ feedId, page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Comment])
  fetchSubComments(
    @Args('pCommentId', { type: () => String }) pCommentId: string,
  ) {
    return this.commentService.findSubComments({ pCommentId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Comment)
  createComment(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
  ) {
    return this.commentService.create({ currentUser, createCommentInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Comment)
  updateComment(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('email') email: string,
    @Args('commentId') commentId: string,
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
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
    @Args('commentId') commentId: string,
  ) {
    return this.commentService.delete({ commentId });
  }
}
