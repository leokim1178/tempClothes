import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feed } from '../feed/entities/feed.entity';
import { User } from '../user/entities/user.entity';
import { FetchCommentOutput } from './dto/fetchComment.output';
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

  async findAll({ feedId, page }) {
    const qb = this.commentRepository
      .createQueryBuilder('Comment')
      .leftJoinAndSelect('Comment.feed', 'feed')
      .leftJoinAndSelect('Comment.pComment', 'pComment')
      .leftJoinAndSelect('Comment.user', 'user')
      .where('Comment.feed = :id', { id: feedId });

    const paging = qb.orderBy('Comment.id', 'ASC');
    if (page) {
      const result = await paging
        .take(10)
        .skip((page - 1) * 10)
        .getManyAndCount();

      const [comments] = result;
      const result1: FetchCommentOutput = { comments, page };

      return result1;
    } else {
      const result2 = await paging.getManyAndCount();

      const [comments] = result2;
      const result3: FetchCommentOutput = { comments };

      return result3;
    }
  }
  async findSubComments({ pCommentId }) {
    const result = await this.commentRepository.find({
      where: { pComment: pCommentId },
      relations: ['pComment', 'user'],
    });
    return result;
  }

  async create({ currentUser, createCommentInput }) {
    const { pCommentId, feedId, commentDetail } = createCommentInput;
    let parentComment;
    if (pCommentId) {
      parentComment = await this.commentRepository.findOne({
        where: { id: pCommentId },
      });
    }

    const comUser = await this.userRepository.findOne({
      where: { email: currentUser.email },
    });

    const feed = await this.feedRepository.findOne({
      where: { id: feedId },
    });

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

    return await this.commentRepository.save({
      ...result,
      user: comUser,
      ...updateCommentInput,
    });
  }

  async delete({ commentId }) {
    await this.commentRepository.delete({
      pComment: commentId,
    });

    const result = await this.commentRepository.delete({
      id: commentId,
    });

    return result.affected ? true : false;
  }
}
