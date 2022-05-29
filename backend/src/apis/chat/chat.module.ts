import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { ChatGateway } from './chat.gateway';
import { AppGateway } from './chat.gateway1';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';
// import { ChatResolver } from './chat.resolver';
// import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, User])],
  providers: [AppGateway, ChatResolver, ChatService],
})
export class ChatModule {}
