import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Cache } from 'cache-manager';
import { PaymentButtonService } from '../payment/payment.service'
import { v4 as uuidv4 } from 'uuid'; // uuid 만드는 라이브러리
import { ChatRoom } from './entities/chatRoom.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @Inject(PaymentButtonService)
    private readonly paymentButtonService: PaymentButtonService
  ) {}

  // async load({ currentUser, host }) {
  //   const myself = await this.chatRepository.find({
  //     // 자기 자신의 정보
  //     where: { user: currentUser.id },
  //     order: { id: 'ASC' },
  //   });

  //   const result = await this.chatRepository.find({
  //     // 채팅하고자 하는 유저
  //     where: { user: host },
  //     order: { id: 'ASC' },
  //   });

  //   let roomNum;
  //   for (let i = 0; i < result.length; i++) {
  //     for (let j = 0; j < myself.length; j++) {
  //       if (myself[j].room === result[i].room) {
  //         roomNum = myself[j].room;
  //         break;
  //       }
  //     }
  //   }

  //   const finalResult = await this.chatRepository.find({
  //     where: { room: roomNum },
  //     order: { id: 'ASC' },
  //     relations: ['user'],
  //   });
  //   return finalResult;
  // }

  async create({ currentUser, guestNickname }){

    const user = await this.userRepository.findOne({
      where: { id : currentUser.id}
    })

    const room = await this.chatRoomRepository.findOne({
      where: { host: user.nickname, guest: guestNickname}
    })

    if( room ) {
      return room.id
    } else {
        const result = await this.chatRoomRepository.save({
        host: user.nickname,
        guest: guestNickname,
      })
      return result.id;
    }
  }
}
