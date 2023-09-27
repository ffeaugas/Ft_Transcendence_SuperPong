import {
  Controller,
  Get,
  UseGuards,
  Query,
  Delete,
  Req,
  Body,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserUpdateDto } from './dto/userUpdate.dto';
import { UserRelationChangeDto } from './dto/userRelationChange.dto';

@Controller('users')
@ApiBearerAuth()
@ApiTags('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('friends')
  async getFriends(@Req() req: Request) {
    return this.usersService.getFriends(req);
  }

  @Get('blockeds')
  async getBlockeds(@Req() req: Request) {
    return this.usersService.getBlockeds(req);
  }

  @Get('relation')
  async getRelationToUser(
    @Req() req: Request,
    @Query('username') username: string,
  ) {
    return this.usersService.getRelationToUser(req, username);
  }

  @Get('onlineUsers')
  async getOnlineUsers() {
    return this.usersService.getOnlineUsers();
  }

  @Patch('changeRelation')
  async updateUserRelation(
    @Req() req: Request,
    @Body() dto: UserRelationChangeDto,
  ) {
    return await this.usersService.updateUserRelation(req, dto);
  }

  @Patch('updateStatus')
  async updateUserStatus(@Req() req: Request) {
    return await this.usersService.updateUserStatus(req);
  }

  @Post('inviteingame')
  async inviteUserInGame(@Req() req: Request, @Body() dto: any) {
    return await this.usersService.inviteUserInGame(req, dto);
  }

  @Get('getGameRequests')
  async getGameRequests(@Req() req) {
    return await this.usersService.getGameRequests(req);
  }

  @Get('getFriendRequests')
  async getFriendRequests(@Req() req) {
    return await this.usersService.getFriendRequests(req);
  }

  @Delete('acceptFriendRequest')
  async acceptFriendRequest(@Req() req: Request, @Body() dto: any) {
    return await this.usersService.acceptFriendRequest(req, dto.senderId);
  }

  @Delete('rejectFriendRequest')
  async rejectFriendRequest(@Req() req: Request, @Body() dto: any) {
    return await this.usersService.deleteFriendRequest(req, dto.senderId);
  }

  @Get('channels')
  async getPrivateChannels(@Query('username') username: string) {
    return this.usersService.getPrivateChannels(username);
  }

  @Get('me')
  async getMe(@Req() req: Request) {
    return this.usersService.getMe(req);
  }

  @Get('all')
  async getAll() {
    return this.usersService.getAll();
  }

  @Get()
  async getUser(
    @Query('username') username?: string,
    @Query('id') id?: string,
  ) {
    if (username) return await this.usersService.getByUsername(username);
    else if (id) return await this.usersService.getById(+id);
    else return await this.usersService.getAllUsers();
  }

  @Patch('update-username')
  async updateUsername(@Body() dto: UserUpdateDto) {
    return await this.usersService.updateUsername(dto);
  }

  @Delete()
  async deleteUser(
    @Query('username') username?: string,
    @Query('id') id?: string,
  ) {
    if (username) return await this.usersService.deleteByUsername(username);
    else if (id) return await this.usersService.deleteById(+id);
    else return await this.usersService.deleteAllUsers();
  }
}
