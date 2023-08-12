import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { MessageService } from './message.service';
import { Request } from 'express';

@Controller('message')
@ApiBearerAuth()
@ApiTags('messages')
@UseGuards(AuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async postMessage(@Body() dto: MessageDto, @Req() req: Request) {
    return this.messageService.postMessage(dto, req);
  }
}
