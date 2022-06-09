import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { ChatGateway } from './chat.gateway';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';
import { ChatRoom } from './entities/chatRoom.entity';
import { ChatMessage } from './entities/chatMessage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, ChatMessage, User])],
  providers: [ChatGateway, ChatResolver, ChatService],
})
export class ChatModule {}
