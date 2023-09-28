import {
  WebSocketServer,
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Message } from '@prisma/client';
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
    //console.log(`client connected : ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    //console.log(`client disconnected : ${client.id}`);
  }

  @SubscribeMessage('NEW_MESSAGE')
  handleEvent(@MessageBody() data: string) {
    //console.log('data:', data);
  }

  sendMessage(message: Message) {
    this.server.emit('NEW_MESSAGE', message);
  }

  deletedChannel(channelName: string) {
    this.server.emit('CHANNEL_DELETE', channelName);
  }

  updateChannel() {
    this.server.emit('CHANNEL_UPDATE');
  }

  kickFromChannel(channelName: string, kickedUser: string) {
    this.server.emit('KICKED_FROM_CHANNEL', channelName, kickedUser);
  }

  inviteInGame() {
    this.server.emit('GAME_INVITATION');
  }
}
