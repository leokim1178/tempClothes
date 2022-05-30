import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { ChatGateway } from './chat.gateway';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';

import { PaymentButtonService } from '../payment/payment.service';
import { PaymentButton } from '../payment/entities/payment.entity';
import { ChatRoom } from './entities/chatRoom.entity';
import { ChatMsg } from './entities/chatMsg.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, ChatMsg, User, PaymentButton])],
  providers: [ChatGateway, ChatResolver, ChatService, PaymentButtonService],
})
export class ChatModule {}
