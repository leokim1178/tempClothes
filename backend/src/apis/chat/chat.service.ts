import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Chat } from './entities/chat.entity';
import { Cache } from 'cache-manager';
import { PaymentButtonService } from '../payment/payment.service';
import { v4 as uuidv4 } from 'uuid'; // uuid 만드는 라이브러리
import { ChatMsg, Msg } from './entities/msg.entity';
import { ChatRoom } from './entities/chatRoom.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(ChatMsg)
    private readonly chatMsgRepository: Repository<ChatMsg>,
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @Inject(PaymentButtonService)
    private readonly paymentButtonService: PaymentButtonService,
  ) {}

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
      relations: ['user'],
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

  async create({ currentUser, opponentNickname }) {
    const uuid = uuidv4(); // uuid 생성하는 라이브러리 씀

    await this.chatRepository.save({
      user: currentUser.id,
      room: uuid,
    });
    const user = await this.userRepository.findOne({
      where: { nickname: opponentNickname },
    });

    await this.chatRepository.save({
      user,
      room: uuid,
    });
    return uuid;
  }
}
