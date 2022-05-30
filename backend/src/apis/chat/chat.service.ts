import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Chat } from './entities/chat.entity';
import { Cache } from 'cache-manager';
import { PaymentButtonService } from '../payment/payment.service'
import { v4 as uuidv4 } from 'uuid'; // uuid 만드는 라이브러리

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @Inject(PaymentButtonService)
    private readonly paymentButtonService: PaymentButtonService
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

    const finalResult = await this.chatRepository.find({
      where: { room: roomNum },
      order: { id: 'ASC' },
      relations: ['user'],
    });
    return finalResult;
  }

  async create({ currentUser, opponentNickname }){
    const pay = await this.paymentButtonService.pay({ currentUser })
    console.log(pay, 'pay')

    const uuid = uuidv4();

     if( pay ){
      await this.chatRepository.save({
        user:currentUser.id,
        room: uuid
      })
    }

    const user = await this.userRepository.findOne({
      where: { nickname: opponentNickname}
    })

  if( pay ){
    await this.chatRepository.save({
      user,
      room: uuid,
    })
  }
    return uuid;
  }
}
