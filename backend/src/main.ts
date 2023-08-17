import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { PrismaService } from './prisma/prisma.service';
import { create } from 'domain';

const prisma = new PrismaService();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
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
    }),
  );
  app.enableCors();
  const name = 'General';
  try {
    const general = await prisma.channel.create({
      data: { channelName: name, password: '', mode: 'PUBLIC' },
    });
    console.log('New channel created:', general);
    console.log(general);

    const achievements = await prisma.achievement.createMany({
      data: [
        {
          title: 'Gros naaaze',
          description: 'etre un gros nul',
          picture: 'default.png',
        },
        {
          title: 'Moyen naaaze',
          description: 'etre un peu un gros nul',
          picture: 'default.png',
        },
        {
          title: 'Pierre',
          description: 'etre Pierre',
          picture: 'default.png',
        },
        {
          title: 'QueryLord',
          description: 'Faire trop de Query',
          picture: 'default.png',
        },
        {
          title: 'Serial Looser',
          description: 'Perdre 5 fois de suite',
          picture: 'default.png',
        },
        {
          title: 'Serial Winner',
          description: 'Perdre 5 fois de suite',
          picture: 'default.png',
        },
        {
          title: 'Boutonneux',
          description: "Ce connecter via l'intra 42",
          picture: 'default.png',
        },
        {
          title: 'Ami de Roger',
          description: 'Etre ami avec Roger',
          picture: 'default.png',
        },
        {
          title: 'English Man',
          description:
            'Pas oublier de traduire tous les achievements en anglais',
          picture: 'default.png',
        },
        {
          title: 'Type sympa',
          description: 'Dire Bonjour dans le chat general',
          picture: 'default.png',
        },
      ],
    });
    console.log('New channel created:', achievements);
    console.log(achievements);
  } catch (error) {
    console.error('Error creating :', error.message);
  }
  await app.listen(3001);
}
bootstrap();
