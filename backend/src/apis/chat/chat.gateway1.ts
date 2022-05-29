import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayDisconnect, OnGateWayConnection, SubscribeMessage, MessageBody, ConnectedSocket} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
    transports: ['websocket'],
    namespace: 'chat',
    cors: { origin: '*', credentials: true },
})

export class AppGateway implements OnGatewayInit, OnGateWayConnection, OnGatewayDisconnect{
    constructor(){}

    @WebSocketServer()
        server: Server;
        private logger: Logger = new Logger('ChatGateway2');

    @SubscribeMessage('events') 
    handleEvent(
        @MessageBody() data : string): string{
            return data;
        }
    
    afterInit(server: Server) {
        this.logger.log('Init')
    }

    handleDisconnect(client: Socket) {
        this.logger.log('Client Disconnected : ${client.id}');
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log('Client Connected : ${client.id}');
    }

    @SubscribeMessage('msgToServer')
    handleMessage(
        @MessageBody() data: MsgReq, // 클라이언트로부터 들어온 메시지
        @ConnectedSocket() client: Socket) {
            const res : MsRes = {
                msg: data.msg,
                senderNickname: data.nickname,
                time: new Date(client.handshake.time).toLocaleString(),
            };
        this.server.emit('msgToClient', res);
    }
    
}