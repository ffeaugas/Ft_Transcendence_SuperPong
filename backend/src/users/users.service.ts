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
import { SocketEvents } from 'src/socket/socketEvents';

enum RelationType {
  FRIEND = 'FRIEND',
  BLOCK = 'BLOCK',
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly profileService: ProfileService,
    private readonly socketEvents: SocketEvents,
  ) {}

  async createUser(dto: AuthDto, user42: boolean): Promise<Users> {
    const passwordHash: string = await argon.hash(dto.password);
    const newUser = await this.prismaService.user.create({
      data: {
        username: dto.login + '_' + Math.random().toString(36).slice(-3),
        login: dto.login,
        hash: passwordHash,
        user42: user42,
        otpEnabled: false,
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
    return;
  }

  async updateUserRelation(req: any, dto: UserRelationChangeDto) {
    const user = await this.prismaService.user.findUnique({
      where: { id: req.user.sub },
      include: { friends: true, blockedUsers: true },
    });
    if (!user) throw new ForbiddenException('User not found');
    const targetUser = await this.prismaService.user.findUnique({
      where: { username: dto.targetUsername },
      include: { friends: true },
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
    targetUser: any,
    req: any,
    dto: UserRelationChangeDto,
  ) {
    const isFriend = user.friends.find(
      (friend) => friend.username === dto.targetUsername,
    );
    //ADD FRIEND
    if (!isFriend) {
      return this.sendFriendRequest(req, user, targetUser);
    }
    //REMOVE FRIEND
    const updatedSenderFriends = user.friends.filter(
      (friend: User) => friend.username != dto.targetUsername,
    );
    const updatedTargetFriends = targetUser.friends.filter(
      (friend: User) => friend.username != user.username,
    );
    const updatedFriendUsers = await this.prismaService.user.update({
      where: { username: user.username },
      data: { friends: { set: updatedSenderFriends } },
    });
    const updatedTargetUsers = await this.prismaService.user.update({
      where: { username: targetUser.username },
      data: { friends: { set: updatedTargetFriends } },
    });
    return updatedFriendUsers;
  }

  //Return void if request was already sent / Accept request if receiver has also sent a request
  async sendFriendRequest(req: Request, sender: any, receiver: any) {
    const existingSentFriendRequest =
      await this.prismaService.friendRequest.findMany({
        where: { AND: [{ senderId: sender.id }, { receiverId: receiver.id }] },
      });
    if (existingSentFriendRequest.length > 0) return; //Return void if request was already sent
    const existingReceivedFriendRequest =
      await this.prismaService.friendRequest.findMany({
        where: { AND: [{ senderId: sender.id }, { receiverId: receiver.id }] },
      });
    if (existingReceivedFriendRequest.length > 0) {
      // Accept request if receiver has also sent a request
      return this.acceptFriendRequest(req, sender.Id);
    }
    //Otherwise : create the request
    const newFriendRequest = await this.prismaService.friendRequest.create({
      data: {
        senderId: sender.id,
        receiverId: receiver.id,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });
    return newFriendRequest;
  }

  removeFriendsFromUsers(users: Users[]) {
    const usersWithoutFriends = users.map((user) => {
      const { friends, ...userWithoutFriends } = user;
      return userWithoutFriends;
    });
    return usersWithoutFriends;
  }

  async acceptFriendRequest(req: any, senderId: number) {
    const receiver = await this.prismaService.user.findUnique({
      where: { id: req.user.sub },
      include: { friends: true },
    });
    if (!receiver) throw new ForbiddenException('User not found');
    const sender = await this.prismaService.user.findUnique({
      where: { id: senderId },
      include: { friends: true },
    });
    if (!sender) throw new ForbiddenException('Request sender not found');
    const existingReceivedFriendRequest =
      await this.prismaService.friendRequest.findMany({
        where: {
          senderId: senderId,
          receiverId: receiver.id,
        },
      });
    if (existingReceivedFriendRequest.length === 0)
      throw new ForbiddenException('Request not found');
    const receiverFriends = [...receiver.friends, sender];
    const updatedReceiverFriends = await this.prismaService.user.update({
      where: { id: receiver.id },
      data: { friends: { set: this.removeFriendsFromUsers(receiverFriends) } },
    });
    const senderFriends = [...sender.friends, receiver];
    const updatedSenderFriends = await this.prismaService.user.update({
      where: { id: sender.id },
      data: { friends: { set: this.removeFriendsFromUsers(senderFriends) } },
    });
    if (receiver.username === 'Roger') {
      const achievement = await this.prismaService.achievement.findUnique({
        where: { title: 'Ami de Roger' },
      });
      const updatedAchievement = await this.prismaService.profile.update({
        where: { userId: sender.id },
        data: { achievements: { connect: achievement } },
      });
    } else if (sender.username === 'Roger') {
      const achievement = await this.prismaService.achievement.findUnique({
        where: { title: 'Ami de Roger' },
      });
      const updatedAchievement = await this.prismaService.profile.update({
        where: { userId: receiver.id },
        data: { achievements: { connect: achievement } },
      });
    }
    return this.deleteFriendRequest(req, senderId);
  }

  async deleteFriendRequest(req: any, senderId: number) {
    const receiver = await this.prismaService.user.findUnique({
      where: { id: req.user.sub },
      include: { friends: true },
    });
    if (!receiver) throw new ForbiddenException('User not found');
    const friendRequest = await this.prismaService.friendRequest.findMany({
      where: { AND: [{ senderId: senderId }, { receiverId: receiver.id }] },
    });
    if (!friendRequest) throw new ForbiddenException('Request not found');
    const deleteFriendRequest = this.prismaService.friendRequest.deleteMany({
      where: { AND: [{ senderId: senderId }, { receiverId: receiver.id }] },
    });
    return deleteFriendRequest;
  }

  async getFriendRequests(req: any) {
    const user = await this.prismaService.user.findUnique({
      where: { id: req.user.sub },
      include: { friends: true },
    });
    if (!user) throw new ForbiddenException('User not found');
    const friendRequests = await this.prismaService.friendRequest.findMany({
      where: { receiverId: user.id },
      include: { sender: true },
    });
    return friendRequests;
  }

  async inviteUserInGame(req: any, dto: any) {
    const sender = await this.prismaService.user.findUnique({
      where: { id: req.user.sub },
    });
    if (!sender) throw new ForbiddenException('User not found');
    const receiver = await this.prismaService.user.findUnique({
      where: { username: dto.receiver },
    });
    if (!receiver) throw new ForbiddenException('Receiver not found');
    const newGameRequest = await this.prismaService.gameRequest.create({
      data: {
        senderId: sender.id,
        receiverId: receiver.id,
        roomId: dto.roomId,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });
    this.socketEvents.inviteInGame();
  }

  async getGameRequests(req: any) {
    const user = await this.prismaService.user.findUnique({
      where: { id: req.user.sub },
      include: { gameReqReceived: true },
    });
    if (!user) throw new ForbiddenException('User not found');
    return user.gameReqReceived;
  }

  async updateBlock(
    user: Users,
    targetUser: Users,
    req: Request,
    dto: UserRelationChangeDto,
  ) {
    let updatedBlockeds: Users[];
    const isBlocked = user.blockedUsers.find(
      (blockedUser) => blockedUser.username === dto.targetUsername,
    );
    if (!isBlocked) {
      updatedBlockeds = [...user.blockedUsers, targetUser];
    } else {
      updatedBlockeds = user.blockedUsers.filter(
        (blockedUser: Users) => blockedUser.username != dto.targetUsername,
      );
    }
    const updatedBlockedsWithoutFriends = updatedBlockeds.map((user) => {
      const { friends, ...userWithoutFriends } = user;
      return userWithoutFriends;
    });
    const updatedBlockedUsers = await this.prismaService.user.update({
      where: { username: user.username },
      data: { blockedUsers: { set: updatedBlockedsWithoutFriends } },
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
    const alreadyExist = await this.prismaService.user.findUnique({
      where: { username: dto.newUsername },
    });
    if (alreadyExist) throw new ForbiddenException('Username already exist');
    if (dto.newUsername === 'Roger') {
      const achievement = await this.prismaService.achievement.findUnique({
        where: { title: 'Roger' },
      });
      const updatedAchievement = await this.prismaService.profile.update({
        where: { userId: userFounded.id },
        data: { achievements: { connect: achievement } },
      });
    }
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
