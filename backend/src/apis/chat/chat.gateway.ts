import { Server } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ChatMsg } from './entities/chatMsg.entity';
import { ChatRoom } from './entities/chatRoom.entity';

@WebSocketGateway({
  namespace: 'chat', // cors문제 해결해줘야 함.
  cors: { origin: '*', credentials: true },
  // transports: ['websocket'],
}) // 방 만들기(포트 설정 해주기)\
@Injectable()
export class ChatGateway {
  constructor(
    @InjectRepository(ChatMsg)
    private readonly chatMsgRepository: Repository<ChatMsg>,
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
      console.log("AAAAA")
      if (client.id == c.id) continue;
      console.log("BBBB")
      c.emit(event, message);
    }
    console.log("CCCC") // 이게 문제인지 확인 해볼것!
  }

  @SubscribeMessage('send')
  async sendMessage(
    @MessageBody() data: string, //
    @ConnectedSocket() client,
  ) {
    const [room, nickname, message] = data;
    const user = await this.userRepository.findOne({
      where: { nickname: nickname },
    });
    
    const result = await this.chatMsgRepository.save({
      // redis에 저장 해보기?!
      user: { id: user.id},
      chatRoom: { id: room },
      message: data[2],
    });

    console.log(`${client.id} : ${data}`);
    this.broadcast(room, client, [nickname, message]);
  }
}
