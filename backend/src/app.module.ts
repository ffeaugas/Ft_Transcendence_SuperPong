import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';
import { ChannelsModule } from './channels/channels.module';
import { ExchangeCodeController } from './exchange-code.controller';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { ProfileService } from './profile/profile.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    ProfileModule,
    ChannelsModule,
    HttpModule,
  ],
  controllers: [AppController, ExchangeCodeController],
  providers: [AppService, AuthService, UsersService, ProfileService],
})
export class AppModule {}
