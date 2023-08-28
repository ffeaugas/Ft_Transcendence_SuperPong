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
import {
  ApiBearerAuth,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChannelModifyDto } from './dto/channelModify.dto';
import { ChannelMode } from '@prisma/client';
import { ChannelJoinDto } from './dto/channelJoin.dto';
import { ChannelInvitationDto } from './dto/channelInvitation.dto';

@Controller('channels')
@ApiBearerAuth()
@ApiTags('channels')
@UseGuards(AuthGuard)
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  // @Get()
  // async getAllUsers(@Query('name') channelName: string) {
  //   return await this.channelsService.getAllUsers(channelName);
  // }

  @Get('is-owner')
  async isOwner(
    @Query('channelName') channelName: string,
    @Query('userId') userId: number,
  ) {
    return await this.channelsService.isOwner(channelName, userId);
  }

  @Get('publics') //NOT USED
  async getAllPublic() {
    return await this.channelsService.getAllPublic();
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

  @Post()
  async createChannel(@Req() req: Request, @Body() dto: ChannelDto) {
    return await this.channelsService.createChannel(req, dto);
  }

  @Patch()
  async setChannelPassword(@Body() dto: ChannelModifyDto, @Req() req: Request) {
    return await this.channelsService.setChannelPassword(dto, req);
  }

  // @Patch('add')
  // @ApiQuery({
  //   name: 'channelName',
  //   description: 'Channel name for adding user.',
  // })
  // @ApiQuery({
  //   name: 'userName',
  //   description: 'The username to add in the channel.',
  // })
  // async addUserByUsername(
  //   @Query('channelName') channelName: string,
  //   @Query('userName') userName: string,
  // ) {
  //   return await this.channelsService.addUserByUsername(channelName, userName);
  // }

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

  @Patch('invite')
  async inviteInChannel(
    @Req() req: Request,
    @Body() dto: ChannelInvitationDto,
  ) {
    return await this.channelsService.inviteInChannel(req, dto);
  }

  @Delete(':channelName')
  async deleteChannel(
    @Req() req: Request,
    @Param('channelName') channelName: string,
  ) {
    return this.channelsService.deleteChannel(req, channelName);
  }
}
