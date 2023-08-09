import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelDto } from './dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('channels')
@UseGuards(AuthGuard)
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  async getAllUsers(@Query('name') channelName: string) {
    return await this.channelsService.getAllUsers(channelName);
  }

  @Get('publics')
  async getAllPublic() {
    return await this.channelsService.getAllPublic();
  }

  @Post()
  async createChannel(@Body() dto: ChannelDto) {
    return await this.channelsService.createChannel(dto);
  }

  @Patch('add')
  async addUserByUsername(
    @Query('channelName') channelName: string,
    @Query('userName') userName: string,
  ) {
    return await this.channelsService.addUserByUsername(channelName, userName);
  }

  @Patch('change-mode')
  async changeChannelMode(
    @Req() req: Request,
    @Query('channelName') channelName: string,
    @Query('mode') mode: string,
  ) {
    return await this.channelsService.changeChannelMode(req, channelName, mode);
  }
}
