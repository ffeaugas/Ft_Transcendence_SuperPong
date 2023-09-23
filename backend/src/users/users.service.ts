import { ForbiddenException, Injectable } from '@nestjs/common';
import { Users } from './users.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileService } from 'src/profile/profile.service';
import { AuthDto } from 'src/auth/dto';
import { Request } from 'express';
import * as argon from 'argon2';
import { ChannelMode, User } from '@prisma/client';
import { UserUpdateDto } from './dto/userUpdate.dto';
import { UserRelationChangeDto } from './dto/userRelationChange.dto';

enum RelationType {
  FRIEND = 'FRIEND',
  BLOCK = 'BLOCK',
}

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
        username: dto.login + '_' + Math.random().toString(36).slice(-3),
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

  async getOnlineUsers() {
    const users = await this.prismaService.user.findMany();
    const date = Math.floor(Date.now() / 1000); //Time in second
    const onlineUsers = users.filter((user) => {
      return date - user.lastConnexionPing < 2; //Consider "offline" every user that hasnt ping during 2 sec
    });
    return onlineUsers.map((onlineUser) => onlineUser.username);
  }

  async updateUserStatus(req: any) {
    const user = await this.prismaService.user.findUnique({
      where: { id: req.user.sub },
    });
    if (!user) throw new ForbiddenException('User not found');
    const date = Math.floor(Date.now() / 1000); //Time in second
    const updatedUser = await this.prismaService.user.update({
      where: { id: req.user.sub },
      data: { lastConnexionPing: date },
    });
    return updatedUser;
  }

  async updateUserRelation(req: any, dto: UserRelationChangeDto) {
    const user = await this.prismaService.user.findUnique({
      where: { id: req.user.sub },
      include: { friends: true, blockedUsers: true },
    });
    if (!user) throw new ForbiddenException('User not found');
    const targetUser = await this.prismaService.user.findUnique({
      where: { username: dto.targetUsername },
    });
    if (!targetUser) throw new ForbiddenException('User not found');
    if (req.user.sub === targetUser.id) {
      throw new ForbiddenException("You can't do this on yourself");
    }
    if (dto.relationType === RelationType.FRIEND)
      this.addOrRemoveFriend(user, targetUser, req, dto);
    else this.updateBlock(user, targetUser, req, dto);
  }

  async addOrRemoveFriend(
    user: any,
    targetUser: User,
    req: any,
    dto: UserRelationChangeDto,
  ) {
    let updatedFriends: User[];
    const isFriend = user.friends.find(
      (friend) => friend.username === dto.targetUsername,
    );
    if (!isFriend) {
      updatedFriends = [...user.friends, targetUser];
    } else {
      updatedFriends = user.friends.filter(
        (friend: User) => friend.username != dto.targetUsername,
      );
    }
    const updatedFriendUsers = await this.prismaService.user.update({
      where: { username: user.username },
      data: { friends: { set: updatedFriends } },
    });
    return updatedFriendUsers;
  }

  async updateBlock(
    user: any,
    targetUser: User,
    req: Request,
    dto: UserRelationChangeDto,
  ) {
    let updatedBlockeds: User[];
    const isBlocked = user.blockedUsers.find(
      (blockedUser) => blockedUser.username === dto.targetUsername,
    );
    if (!isBlocked) {
      updatedBlockeds = [...user.blockedUsers, targetUser];
    } else {
      updatedBlockeds = user.blockedUsers.filter(
        (blockedUser: User) => blockedUser.username != dto.targetUsername,
      );
    }
    const updatedBlockedUsers = await this.prismaService.user.update({
      where: { username: user.username },
      data: { blockedUsers: { set: updatedBlockeds } },
    });
    return updatedBlockedUsers;
  }

  async getRelationToUser(req: Request, targetUsername: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: req['user'].sub },
      include: { friends: true, blockedUsers: true },
    });
    if (!user) throw new ForbiddenException('User not found');
    const targetUser = await this.prismaService.user.findUnique({
      where: { username: targetUsername },
    });
    if (!targetUser) throw new ForbiddenException('Target not found');
    const isFriend = user.friends.some(
      (friend) => friend.username === targetUsername,
    );
    const isBlocked = user.blockedUsers.some(
      (blockedUser) => blockedUser.username === targetUsername,
    );
    console.log({ isFriend, isBlocked });
    return { isFriend, isBlocked };
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
      include: { blockedUsers: true },
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
        channelsOwned: true,
        channelsInvited: true,
      },
    });
    if (users.length <= 0) throw new ForbiddenException('No users found');
    users.forEach((user) => {
      delete user.hash;
    });
    return users;
  }

  async getFriends(req: any): Promise<Users[]> {
    const user = await this.prismaService.user.findUnique({
      where: { id: req['user'].sub },
      include: { friends: { include: { profile: true } } },
    });
    if (!user) throw new ForbiddenException('User not found');
    return user.friends;
  }

  async getBlockeds(req: any): Promise<Users[]> {
    const user = await this.prismaService.user.findUnique({
      where: { id: req['user'].sub },
      include: { blockedUsers: true },
    });
    if (!user) throw new ForbiddenException('User not found');
    return user.blockedUsers;
  }

  async updateUsername(dto: UserUpdateDto) {
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
