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
import { MessageModule } from './message/message.module';
import { SocketModule } from './socket/socket.module';
import { AchievementController } from './achievement/achievement.controller';
import { AchievementService } from './achievement/achievement.service';
import { AchievementModule } from './achievement/achievement.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    ProfileModule,
    ChannelsModule,
    HttpModule,
    MessageModule,
    SocketModule,
    AchievementModule,
  ],
  controllers: [AppController, ExchangeCodeController, AchievementController],
  providers: [
    AppService,
    AuthService,
    UsersService,
    ProfileService,
    AchievementService,
  ],
})
export class AppModule {}
