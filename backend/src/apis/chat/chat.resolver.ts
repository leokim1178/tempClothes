import { CACHE_MANAGER, Injectable, Inject, UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth-guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { ChatService } from './chat.service';
import { ChatMessage } from './entities/chatMessage.entity';
import { ChatRoom } from './entities/chatRoom.entity';

@Resolver()
export class ChatResolver {
  constructor(
    private readonly chatService: ChatService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => ChatRoom)
  createRoom(
    @CurrentUser() currentUser: ICurrentUser, //
    @Args('opponentNickname') opponentNickname: string,
  ) {
    return this.chatService.create({ opponentNickname, currentUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => ChatRoom)
  connectionRoom(
    @CurrentUser() currentUser: ICurrentUser, //
    @Args('hostNickname') hostNickname: string,
  ) {
    return this.chatService.join({ currentUser, hostNickname });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [ChatMessage])
  fetchLogs(
    @CurrentUser() currentUser: ICurrentUser, //
    @Args('room') room: string,
  ) {
    return this.chatService.load({ room, currentUser });
  }
}
