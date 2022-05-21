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

  async findOne({ feedId }) {
    const result = await this.commentRepository.findOne({
      where: { feed: feedId },
      relations: ['feed'],
    });
    console.log(result);

    return result;
  }

  async create({ email, createCommentInput }) {
    console.log(email, '유저아이디');
    console.log('댓글내용');
    const { pCommentId, feedId, comment } = createCommentInput;
    let parentComment;
    if (pCommentId) {
      parentComment = await this.commentRepository.findOne({
        where: { id: pCommentId },
      });
    }
    console.log(parentComment, '부모댓글');

    const comUser = await this.userRepository.findOne({
      where: { email: email },
    });

    console.log(comUser);

    return await this.commentRepository.save({
      user: comUser,
      feed: feedId,
      comment: comment,
      pComment: parentComment,
    });
  }

  async update({ commentId, email, updateCommentInput }) {
    const result = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    console.log(result);
    return await this.commentRepository.save({
      ...result,
      user: email,
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
