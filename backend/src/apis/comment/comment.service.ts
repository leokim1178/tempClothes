import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async findOne({ feedId }) {
    return await this.commentRepository.findOne({
      where: { id: feedId },
      relations: ['feed'],
    });
  }

  async create({ mainDetail, feedId, userId }) {
    console.log(feedId, '피드아이디');
    console.log(userId, '유저아이디');
    console.log(mainDetail, '댓글내용');
    return await this.commentRepository.save({
      mainDetail: mainDetail,
      feed: { id: feedId },
      comUser: { userId }, // id 자체가 유저아이디이기 때문
    });
  }

  async update({ mainDetail, commentId, userId }) {
    const result = await this.commentRepository.findOne({
      where: { id: commentId, comUser: userId }, // 가능한지 테스트 해봐야 할듯
      relations: ['comUser'],
    });
    console.log(result, '댓글 업데이트');

    return await this.commentRepository.save({
      ...result,
      mainDetail,
    });
  }

  async delete({ userId, commentId }) {
    const result = await this.commentRepository.delete({
      id: commentId,
    });

    return result.affected ? true : false;
  }
}
