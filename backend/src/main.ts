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
  } catch (error) {
    console.error('Error creating channel:', error.message);
  }
  await app.listen(3001);
}
bootstrap();
