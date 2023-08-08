import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { HttpModule } from '@nestjs/axios';
import { ProfileService } from 'src/profile/profile.service';

@Module({
  imports: [
    HttpModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '10d' },
    }),
  ],
  providers: [AuthService, UsersService, ProfileService],
  controllers: [AuthController],
})
export class AuthModule {}
