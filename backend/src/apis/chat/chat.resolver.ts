import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth-guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { ChatService } from './chat.service';
import { ChatRoom } from './entities/chatRoom.entity';

import { ChatMsg } from './entities/chatMsg.entity';

@Resolver()
export class ChatResolver {
  constructor(
    private readonly chatService: ChatService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // @Inject(CACHE_MANAGER) // private readonly cacheManager: Cache,
  ) {}

  @UseGuards(GqlAuthAccessGuard) // 채팅 로그 불러오기
  @Query(() => [ChatMsg])
  fetchLogs(
    @Args('guestNickname') guestNickname: string, //
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.chatService.loadLogs({ currentUser, guestNickname });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => ChatRoom)
  fetchRoom(
    @Args('guestNickname') guestNickname: string, //
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.chatService.findRoom({ currentUser, guestNickname });
  }

  @UseGuards(GqlAuthAccessGuard) // 룸번호 만들기(uuid)
  @Mutation(() => String)
  async createRoom(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('guestNickname') guestNickname: string, //
  ) {
    return this.chatService.create({ currentUser, guestNickname });
  }
}
