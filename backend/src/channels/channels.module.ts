import { Module } from '@nestjs/common';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { ProfileService } from 'src/profile/profile.service';
import { ProfileModule } from 'src/profile/profile.module';
import { SocketModule } from 'src/socket/socket.module';
import { SocketEvents } from 'src/socket/socketEvents';

@Module({
  imports: [UsersModule, ProfileModule, SocketModule],
  controllers: [ChannelsController],
  providers: [ChannelsService, UsersService, ProfileService, SocketEvents],
})
export class ChannelsModule {}
