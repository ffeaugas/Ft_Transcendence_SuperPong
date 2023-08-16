import {
  WebSocketServer,
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
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

  handleDisconnection(client: Socket) {
    console.log(`client disconnected : ${client.id}`);
  }

  //recevoir un event
  @SubscribeMessage('message')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    console.log('data : ', data);
    this.server.emit('message', client.id, data);
  }
}
