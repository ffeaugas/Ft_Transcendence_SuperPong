import { Module } from '@nestjs/common';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { ProfileService } from 'src/profile/profile.service';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  imports: [UsersModule, ProfileModule],
  controllers: [ChannelsController],
  providers: [ChannelsService, UsersService, ProfileService],
})
export class ChannelsModule {}
