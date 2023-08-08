import { Body, Controller, Get, Post, Query, Patch } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelDto } from './dto';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  async createChannel(@Body() dto: ChannelDto) {
    return await this.channelsService.createChannel(dto);
  }

  @Patch()
  async addUserByUsername(
    @Query('channelName') channelName: string,
    @Query('userName') userName: string,
  ) {
    return await this.channelsService.addUserByUsername(channelName, userName);
  }

  @Get()
  async getAllUsers(@Query('name') channelName: string) {
    return await this.channelsService.getAllUsers(channelName);
  }
}
