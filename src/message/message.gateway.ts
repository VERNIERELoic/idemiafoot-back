import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/user.entity';

let users = [];

@WebSocketGateway({
  cors: {
    origin: (origin, callback) => {
      const configService = new ConfigService();
      const allowedOrigins = [configService.get<string>('FRONT')];
      if (allowedOrigins.indexOf(origin) === -1) {
        callback(new Error('Not allowed by CORS'));
      } else {
        callback(null, true);
      }
    },
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['polling']
})
export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private messageService: MessageService, private configService: ConfigService) {
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: { user: User,  text: string; }): Promise<void> {
    const newMessage = await this.messageService.createMessage(payload.user, payload.text);
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
