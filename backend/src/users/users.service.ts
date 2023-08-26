import { ForbiddenException, Injectable } from '@nestjs/common';
import { Users } from './users.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileService } from 'src/profile/profile.service';
import { AuthDto } from 'src/auth/dto';
import { Request } from 'express';
import * as argon from 'argon2';
import { ChannelMode } from '@prisma/client';
import { UserDto, UsernameUpdateDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly profileService: ProfileService,
  ) {}

  async createUser(dto: AuthDto, user42: boolean): Promise<Users> {
    const passwordHash: string = await argon.hash(dto.password);
    const newUser = await this.prismaService.user.create({
      data: {
        username: dto.login + '_' + Math.random().toString(36).slice(-16),
        login: dto.login,
        hash: passwordHash,
        user42: user42,
      },
    });
    await this.prismaService.profile.create({
      data: {
        userId: newUser.id,
      },
    });
    delete newUser.hash;
    return newUser;
  }

  async addOrRemoveFriend(req: any, dto: UserDto) {
    const userReq = await this.prismaService.user.findUnique({
      where: { id: req.user.sub },
      include: { friends: { include: { profile: true } } },
    });
    if (!userReq) {
      throw new ForbiddenException('User not found');
    }
    const userFriend = await this.prismaService.user.findUnique({
      where: { username: dto.username },
    });
    if (!userFriend) {
      throw new ForbiddenException('Friend user not found');
    }
    if (req.user.sub === userFriend.id) {
      throw new ForbiddenException("You can't be friend with yourself");
    }
    const isFriend = userReq.friends.find(
      (friend) => friend.username === dto.username,
    );
    if (isFriend) {
      console.log('REMOVE FRIEND');

      const updatedUser = await this.prismaService.user.update({
        where: { id: userReq.id },
        data: {
          friends: {
            disconnect: { username: dto.username },
          },
        },
        include: {
          friends: true,
        },
      });
      updatedUser.friends.forEach((friend) => {
        delete friend.hash;
      });
      delete updatedUser.hash;
      return updatedUser;
    } else {
      console.log('ADD FRIEND');
      const updatedUser = await this.prismaService.user.update({
        where: { id: userReq.id },
        data: {
          friends: {
            connect: { username: dto.username },
          },
        },
        include: {
          friends: true,
        },
      });
      updatedUser.friends.forEach((friend) => {
        delete friend.hash;
      });
      delete updatedUser.hash;
      return updatedUser;
    }
  }

  async getFriends(req: any, user: string) {
    const userReq = await this.prismaService.user.findUnique({
      where: { username: user },
      include: { friends: { include: { profile: true } } },
    });
    if (!userReq) throw new ForbiddenException('User not found');
    userReq.friends.forEach((friend) => {
      delete friend.hash;
    });
    return userReq.friends;
  }

  async getPrivateChannels(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: { username: username },
    });
    if (!user) throw new ForbiddenException('User not found');
    const privateChannels = await this.prismaService.channel.findMany({
      where: { mode: ChannelMode.PRIVATE || ChannelMode.PROTECTED },
    });
    if (!privateChannels)
      throw new ForbiddenException('No private channels found.');
    return privateChannels;
  }

  async getByUsername(login: string): Promise<Users> {
    const user = await this.prismaService.user.findUnique({
      where: { login: login },
    });
    if (!user) throw new ForbiddenException('User not found');
    return user;
  }

  async getMe(req: Request): Promise<Users> {
    const id = req['user'].sub;
    const user = await this.prismaService.user.findUnique({
      where: { id: id },
      include: { channels: true },
    });
    if (!user) throw new ForbiddenException('User not found');
    delete user.hash;
    return user;
  }

  async getAll(): Promise<Users[]> {
    const users = await this.prismaService.user.findMany();
    if (!users) throw new ForbiddenException('Users not found');
    users.forEach((user) => delete user.hash);
    return users;
  }

  async getById(id: number): Promise<Users> {
    const user = await this.prismaService.user.findUnique({
      where: { id: id },
    });
    if (!user) throw new ForbiddenException('User not found');
    delete user.hash;
    return user;
  }

  async getAllUsers(): Promise<Users[]> {
    const users = await this.prismaService.user.findMany({
      include: {
        channels: true,
        channelsOwned: true,
      },
    });
    if (users.length <= 0) throw new ForbiddenException('No users found');
    users.forEach((user) => {
      delete user.hash;
    });
    return users;
  }

  async updateUsername(dto: UsernameUpdateDto) {
    const userFounded = await this.prismaService.user.findUnique({
      where: { username: dto.oldUsername },
    });
    return await this.prismaService.user.update({
      where: { id: userFounded.id },
      data: { username: dto.newUsername },
    });
  }

  async deleteByUsername(username: string) {
    await this.profileService.deleteProfileByUsername(username);
    return await this.prismaService.user.delete({
      where: { username: username },
    });
  }

  async deleteById(id: number) {
    await this.profileService.deleteProfileById(id);
    return await this.prismaService.user.delete({
      where: { id: id },
    });
  }

  async deleteAllUsers() {
    await this.profileService.deleteAllProfiles();
    return await this.prismaService.user.deleteMany();
  }
}
