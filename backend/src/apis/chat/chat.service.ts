import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Cache } from 'cache-manager';
import { PaymentButtonService } from '../payment/payment.service';

import { ChatMsg } from './entities/chatMsg.entity';
import { ChatRoom } from './entities/chatRoom.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ChatMsg)
    private readonly chatMsgRepository: Repository<ChatMsg>,
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @Inject(PaymentButtonService)
    private readonly paymentButtonService: PaymentButtonService,
  ) {}

  async create({ currentUser, guestNickname }) {
    const user = await this.userRepository.findOne({
      where: { id: currentUser.id },
    });

    const room = await this.chatRoomRepository.findOne({
      where: { host: user.nickname, guest: guestNickname },
    });

    if (room) {
      return room.id;
    } else {
      const result = await this.chatRoomRepository.save({
        host: user.nickname,
        guest: guestNickname,
      });
      return result.id;
    }
  }
  async loadLogs({ currentUser, guestNickname }) {
    const user = await this.userRepository.findOne({
      where: {
        id: currentUser.id,
      },
    });
    if (!user) throw new NotFoundException('유저정보가 존재하지 않습니다');
    const room = await this.chatRoomRepository.findOne({
      where: { host: user.nickname, guest: guestNickname },
    });

    if (!room) throw new NotFoundException('채팅방이 존재하지 않습니다');
    const result = await this.chatMsgRepository.find({
      where: {
        chatRoom: room,
      },
      relations: ['user','chatRoom'],
    });
    return result;
  }

  async findRoom({ currentUser, guestNickname }) {
    const user = await this.userRepository.findOne({
      where: {
        id: currentUser.id,
      },
    });
    if (!user) throw new NotFoundException('유저정보가 존재하지 않습니다');
    const room = await this.chatRoomRepository.findOne({
      where: { host: user.nickname, guest: guestNickname },
    });
    if (!room) throw new NotFoundException('채팅방이 존재하지 않습니다');

    return room;
  }
}
