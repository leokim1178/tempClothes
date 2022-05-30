import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { ChatGateway } from './chat.gateway';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { PaymentButtonService } from '../payment/payment.service'
import { PaymentButton } from '../payment/entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, User, PaymentButton])],
  providers: [ChatGateway, ChatResolver, ChatService, PaymentButtonService],
})
export class ChatModule {}
