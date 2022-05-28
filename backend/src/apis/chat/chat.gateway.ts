import { Server } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { CurrentUser } from 'src/commons/auth/gql-user.param'; // 로그인 인증된
import { Chat } from './entities/chat.entity';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
  namespace: 'chat', // cors문제 해결해줘야 함.
  cors: { origin: '*', credentials: true },
  transports: ['websocket'],
}) // 방 만들기(포트 설정 해주기)\
@Injectable()
export class ChatGateway {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(User)
    private readonly userRepositoey: Repository<User>,
  ) {}

  @WebSocketServer()
  server: Server;

  wsClients = [];

  @SubscribeMessage('message')
  connectSomeone(
    @MessageBody() data: string, //
    @ConnectedSocket() client,
  ) {
    const [nickname, room] = data; // 채팅방 입장!
    // console.log(`${nickname}님이 유저: ${room}방에 접속했습니다.`) // 채팅 기능 활성화 부분(수정해야 할 부분)
    const receive = `${nickname}님이 입장했습니다.`;
    this.server.emit('receive' + room, receive);
    console.log(this.server, 'server');
    this.wsClients.push(client);
  }

  private broadcast(event, client, message: any) {
    for (let c of this.wsClients) {
      if (client.id == c.id) continue;
      c.emit(event, message);
    }
  }

  @SubscribeMessage('send')
  async sendMessage(
    @MessageBody() data: string, //
    @ConnectedSocket() client,
  ) {
    const [room, nickname, message] = data;
    const user = await this.userRepositoey.findOne({
      where: { nickname: nickname },
    });

    const result = await this.chatRepository.save({
      // redis에 저장 해보기?!
      user: user,
      room: room,
      message: data[2],
    });

    console.log(`${client.id} : ${data}`);
    this.broadcast(room, client, [nickname, message]);
  }
}
