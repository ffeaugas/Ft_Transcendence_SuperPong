import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ProfileService } from 'src/profile/profile.service';

@Module({
  exports: [UsersModule],
  providers: [UsersService, ProfileService],
  controllers: [UsersController],
})
export class UsersModule {}
