import { Controller, Get, UseGuards, Query, Delete, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfileByUsername(
    @Query('username') username: string,
  ): Promise<any> {
    return this.usersService.getProfileByUsername(username);
  }

  @Get('channels')
  async getPrivateChannels(@Query('username') username: string) {
    return this.usersService.getPrivateChannels(username);
  }

  @Get('me')
  async getMe(@Req() req: Request) {
    return this.usersService.getMe(req);
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
