import {
  WebSocketServer,
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Channel, Message } from '@prisma/client';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketEvents {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`client connected : ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`client disconnected : ${client.id}`);
  }

  @SubscribeMessage('message')
  handleEvent(@MessageBody() data: string, client: any) {
    console.log('data:', data);
  }

  sendMessage(message: Message) {
    console.log(message);
    this.server.emit('message', message);
  }

  deletedChannel(channel: Channel) {
    this.server.emit('deleted-channel', channel);
  }

  createdChannel(channel: Channel) {
    this.server.emit('created-channel', channel);
  }
}
