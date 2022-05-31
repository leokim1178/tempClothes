import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {}

  async load({ currentUser, host }) {
    const myself = await this.chatRepository.find({
      // 자기 자신의 정보
      where: { user: currentUser.id },
      order: { id: 'ASC' },
    });

    const result = await this.chatRepository.find({
      // 채팅하고자 하는 유저
      where: { user: host },
      order: { id: 'ASC' },
    });

    let roomNum;
    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < myself.length; j++) {
        if (myself[j].room === result[i].room) {
          roomNum = myself[j].room;
          break;
        }
      }
    }
    return await this.chatRepository.find({
      where: { room: roomNum },
      order: { id: 'ASC' },
      relations: ['user'],
    });
  }
}
