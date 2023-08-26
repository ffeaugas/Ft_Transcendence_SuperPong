import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
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

  @Get(':username')
  async getPrivMessage(
    @Param('username') username: string,
    @Req() req: Request,
  ) {
    return this.messageService.getPrivMessage(username, req);
  }
}
