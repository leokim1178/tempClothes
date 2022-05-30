import { Injectable } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";



@WebSocketGateway({
    namespace: 'chat',
    // transports: ['websocket'],
    cors: { origin: "*", credentials: true },
})

@Injectable()
export class ChatGateway1 {
    constructor(){}

    @SubscribeMessage('events')
    handleEvent(
        @MessageBody() data: string
    ): string {
        return data;
    }
}


