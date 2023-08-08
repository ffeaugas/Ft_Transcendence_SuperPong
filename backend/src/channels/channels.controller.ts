import { Body, Controller, Post } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelDto } from './dto';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  async createChannel(@Body() dto: ChannelDto) {
    return await this.channelsService.createChannel(dto);
  }
}
