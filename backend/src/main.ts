import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { GameService } from './game.service';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { PrismaService } from './prisma/prisma.service';
import { MyRoom } from './rooms/MyRoom';
import { MyRoomGameBonus } from './rooms/MyRoomGameBonus';

const prisma = new PrismaService();

const ROOMS = [MyRoom, MyRoomGameBonus];

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({ origin: '*' });
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    index: false,
    prefix: '/uploads',
  });
  const config = new DocumentBuilder()
    .setTitle('Api transcendence by jojo')
    .setDescription('The best transcendence api')
    .setVersion('1.0')
    .addTag('transcendence')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  const name = 'General';
  try {
    const general = await prisma.channel.create({
      data: { channelName: name, password: '', mode: 'PUBLIC' },
    });

    const achievements = await prisma.achievement.createMany({
      data: [
        {
          title: 'Roger',
          description: 'be Roger',
          picture: 'sadnessAchievement.png',
        },
        {
          title: 'Serial Looser',
          description: 'Loose 5 games in a row',
          picture: 'keep-calm-i-m-just-serial-loser.png',
        },
        {
          title: 'Serial Winner',
          description: 'Win 5 games in a row',
          picture: 'crown.png',
        },
        {
          title: 'GPU Eater',
          description: 'Connect via 42 intranet',
          picture: 'gpueater.png',
        },
        {
          title: "Roger's friend",
          description: 'Be friend with Roger',
          picture: 'befriend.png',
        },
        {
          title: 'Good boy',
          description: "Say 'Bonjour' in the General channel",
          picture: 'goodboy.png',
        },
      ],
    });
  } catch (error) {
    console.error('Error creating :', error.message);
  }

  app.enableShutdownHooks();

  const gameSvc = app.get(GameService);

  gameSvc.createServer(app.getHttpServer());

  ROOMS.forEach((r) => {
    console.info(`Registering room: ${r.name}`);
    gameSvc.defineRoom(r.name, r);
  });

  await app.listen(3001);
}
bootstrap();
