import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Patch,
  UseGuards,
  Req,
  Delete,
  Param,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelDto } from './dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChannelModifyDto } from './dto/channelModify.dto';
import { ChannelJoinDto } from './dto/channelJoin.dto';
import { ChannelLeaveDto } from './dto/channelLeave.dto';
import { ChannelUpdateDto } from './dto/channelUpdate.dto ';

@Controller('channels')
@ApiBearerAuth()
@ApiTags('channels')
@UseGuards(AuthGuard)
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get('infos')
  async getChannelInfos(@Query('channelName') channelName: string) {
    return await this.channelsService.getChannelInfos(channelName);
  }

  @Patch('leave-channel')
  async leaveChannel(@Body() dto: ChannelLeaveDto, @Req() req: Request) {
    return await this.channelsService.leaveChannel(dto, req);
  }

  @Get('all')
  async getAllChannels() {
    return await this.channelsService.getAllChannels();
  }

  @Patch('get-authorization')
  async getAuthorization(@Body() dto: ChannelJoinDto, @Req() req: Request) {
    return await this.channelsService.getAuthorization(dto, req);
  }

  @Get('messages')
  async getAllMessageFromChannelName(
    @Query('channelName') channelName: string,
    @Query('isPrivMessage') isPrivMessage: boolean,
  ) {
    return this.channelsService.getAllMessageFromChannelName(
      channelName,
      isPrivMessage,
    );
  }

  // @Get('invited-users')
  // async getInvitedUsers(
  //   @Query('channelName') channelName: string,
  //   @Req() req: Request,
  // ) {
  //   return await this.channelsService.getInvitedUsers(channelName, req);
  // }

  // @Get('banned-users')
  // async getBannedUsers(
  //   @Query('channelName') channelName: string,
  //   @Req() req: Request,
  // ) {
  //   return await this.channelsService.getBannedUsers(channelName, req);
  // }

  // @Get('admin-users')
  // async getAdminUsers(
  //   @Query('channelName') channelName: string,
  //   @Req() req: Request,
  // ) {
  //   return await this.channelsService.getAdminUsers(channelName, req);
  // }

  @Post()
  async createChannel(@Req() req: Request, @Body() dto: ChannelDto) {
    return await this.channelsService.createChannel(req, dto);
  }

  @Patch()
  async setChannelPassword(@Body() dto: ChannelModifyDto, @Req() req: Request) {
    return await this.channelsService.setChannelPassword(dto, req);
  }

  @Patch('change-mode')
  @ApiResponse({
    status: 201,
    description: 'The channel mode has been successfully changed.',
  })
  @ApiResponse({
    status: 403,
    description: "User isn't owner channel Forbidden.",
  })
  async changeChannelMode(@Req() req: Request, @Body() dto: ChannelModifyDto) {
    return await this.channelsService.changeChannelMode(req, dto);
  }

  @Patch('update')
  async updateChannel(@Req() req: Request, @Body() dto: ChannelUpdateDto) {
    return await this.channelsService.updateChannel(req, dto);
  }

  // @Patch('add-admin')
  // async addAdminToChannel(@Req() req: Request, @Body() dto: ChannelUpdateDto) {
  //   return await this.channelsService.addAdminToChannel(req, dto);
  // }

  // @Patch('kick')
  // async kickFromChannel(@Req() req: Request, @Body() dto: ChannelUpdateDto) {
  //   return await this.channelsService.kickFromChannel(req, dto);
  // }

  @Delete(':channelName')
  async deleteChannel(
    @Req() req: Request,
    @Param('channelName') channelName: string,
  ) {
    return this.channelsService.deleteChannel(req, channelName);
  }
}
