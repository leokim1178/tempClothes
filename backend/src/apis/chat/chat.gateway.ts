import { Server } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { CurrentUser } from 'src/commons/auth/gql-user.param'; // 로그인 인증된

@WebSocketGateway({
  namespace: 'chat', // cors문제 해결해줘야 함.
  cors: { origin: '*' },
}) // 방 만들기(포트 설정 해주기)
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  wsClients = [];

  @SubscribeMessage('message')
  connectSomeone(@MessageBody() data: string, @ConnectedSocket() client) {
    const [nickname, room] = data;
    // console.log(`${nickname}님이 유저: ${room}방에 접속했습니다.`) // 채팅 기능 활성화 부분(수정해야 할 부분)
    console.log('BBB');
    const receive = `${nickname}님이 입장했습니다.`;
    this.server.emit('receive' + room, receive);
    this.wsClients.push(client);
  }

  private broadcast(event, client, message: any) {
    for (let c of this.wsClients) {
      if (client.id == c.id) continue;
      c.emit(event, message);
    }
  }

  @SubscribeMessage('send')
  sendMessage(@MessageBody() data: string, @ConnectedSocket() client) {
    const [room, nickname, message] = data;
    console.log('AAA');
    console.log(`${client.id} : ${data}`);
    this.broadcast(room, client, [nickname, message]);
  }
}
