import { MiddlewareConsumer, Module } from '@nestjs/common';
import { monitor } from '@colyseus/monitor';
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
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { SocketEvents } from './socket/socketEvents';

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
    LeaderboardModule,
    SocketModule,
  ],
  controllers: [
    AppController,
    ExchangeCodeController,
    AchievementController,
    GameController,
  ],
  providers: [
    AppService,
    AuthService,
    UsersService,
    ProfileService,
    AchievementService,
    GameService,
    SocketEvents,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(monitor()).forRoutes('/monitor');
  }
}
