import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SubComment } from './entities/subComment.entity';

@Injectable()
export class SubCommentService {
  constructor(
    @InjectRepository(SubComment)
    private readonly subCommentRepository: Repository<SubComment>,
  ) {}

  async findOne({ commentId }) {
    return await this.subCommentRepository.findOne({
      where: { id: commentId },
      relations: ['comment'],
    });
  }

  async create({ subDetail, commentId, userId }) {
    return await this.subCommentRepository.save({
      subDetail: subDetail,
      comment: { id: commentId },
      subComUser: { userId },
    });
  }

  async update({ subDetail, subCommentId, userId }) {
    const result = await this.subCommentRepository.findOne({
      where: { id: subCommentId, subComUser: userId }, // 가능한지 테스트 해봐야 할듯
      relations: ['subComUser'],
    });
    console.log(result, '업데이트 대댓글');

    return await this.subCommentRepository.save({
      ...result,
      subDetail,
    });
  }

  async delete({ commentId, userId }) {
    return await this.subCommentRepository.delete({
      comment: commentId,
      subComUser: userId,
    });
  }
}
