import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ProfileService } from 'src/profile/profile.service';
import { SocketEvents } from 'src/socket/socketEvents';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [SocketModule],
  exports: [UsersModule],
  providers: [UsersService, ProfileService, SocketEvents],
  controllers: [UsersController],
})
export class UsersModule {}
