import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { SocketEvents } from 'src/socket/socketEvents';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [SocketModule],
  providers: [MessageService, SocketEvents],
  controllers: [MessageController],
})
export class MessageModule {}
