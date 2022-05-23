import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feed } from '../feed/entities/feed.entity';
import { User } from '../user/entities/user.entity';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll({ feedId }) {
    const result = await this.commentRepository.find({
      where: { feed: feedId },
      relations: ['pComment','user']
    });
    console.log(result, 'ccc')

    return result;
  }

  async create({ currentUser, createCommentInput }) {
    console.log('댓글내용');
    const { pCommentId, feedId, commentDetail } = createCommentInput;
    let parentComment;
    if (pCommentId) {
      parentComment = await this.commentRepository.findOne({
        where: { id: pCommentId },
      });
    }
    console.log(parentComment, '부모댓글');

    const comUser = await this.userRepository.findOne({
      where: { email: currentUser.email },
    });

    const feed = await this.feedRepository.findOne({
      where: { id: feedId },
    });
    console.log(comUser);

    return await this.commentRepository.save({
      user: comUser,
      feed,
      commentDetail,
      pComment: parentComment,
    });
  }

  async update({ commentId, email, updateCommentInput }) {
    const result = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    const comUser = await this.userRepository.findOne({
      where: { email: email },
    });

    console.log(result);
    return await this.commentRepository.save({
      ...result,
      user: comUser,
      ...updateCommentInput,
    });
  }

  async delete({ commentId }) {
    const result2 = await this.commentRepository.delete({
      pComment: commentId,
    });

    const result = await this.commentRepository.delete({
      id: commentId,
    });

    console.log(result, '댓글삭제');
    console.log(result2, '대댓글삭제');
    return result.affected ? true : false;
  }
}
