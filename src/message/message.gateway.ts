import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';

let users = [];

@WebSocketGateway({
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['polling']
})
export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private messageService: MessageService) {
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: { username: string; text: string; }): Promise<void> {
    const newMessage = await this.messageService.createMessage(payload.username, payload.text);
    this.server.emit('messageFromServer', newMessage);
  }


  afterInit(server: Server) {
    console.log('Init');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    users.push(client.id);
    this.server.emit('users', users);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const index = users.indexOf(client.id);
    if (index > -1) {
      users.splice(index, 1);
    }
    this.server.emit('users', users);
  }
}
