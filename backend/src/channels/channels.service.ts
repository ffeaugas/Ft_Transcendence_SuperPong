import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChannelDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelMode, User } from '@prisma/client';
import { Request } from 'express';
import { ChannelUpdateModeDto } from './dto/channelUpdateMode.dto';
import * as argon from 'argon2';
import { SocketEvents } from 'src/socket/socketEvents';
import { ChannelJoinDto } from './dto/channelJoin.dto';
import { ChannelUpdateDto } from './dto/channelUpdate.dto ';
import { ChannelLeaveDto } from './dto/channelLeave.dto';

enum UpdateType {
  KICK_PLAYER = 'KICK_PLAYER',
  INVITE_PLAYER = 'INVITE_PLAYER',
  SET_PLAYER_ADMIN = 'SET_PLAYER_ADMIN',
  UNSET_PLAYER_ADMIN = 'UNSET_PLAYER_ADMIN',
  BAN_PLAYER = 'BAN_PLAYER',
  DEBAN_PLAYER = 'DEBAN_PLAYER',
}

@Injectable()
export class ChannelsService {
  constructor(
    private prisma: PrismaService,
    private readonly socketEvents: SocketEvents,
  ) {}

  async createChannel(req: Request, dto: ChannelDto) {
    try {
      const owner = await this.prisma.user.findUnique({
        where: { id: req['user'].sub },
      });
      if (!owner) throw new ForbiddenException('User not found.');
      const newChannel = await this.prisma.channel.findUnique({
        where: { channelName: dto.channelName },
      });
      if (newChannel) throw new ForbiddenException('Channel already exists');
      const channelDatas = {
        ownerId: owner.id,
        channelName: dto.channelName,
        mode: dto.mode,
      };
      if (dto.mode === ChannelMode.PROTECTED) {
        const hashPsswd = await argon.hash(dto.password);
        channelDatas['password'] = hashPsswd;
      }
      const createdChannel = await this.prisma.channel.create({
        data: channelDatas,
      });
      return createdChannel;
    } catch (error) {
      throw error;
    }
  }

  async changeChannelMode(req: Request, dto: ChannelUpdateModeDto) {
    const channelPatch = { mode: dto.mode };
    const user = await this.prisma.user.findUnique({
      where: { id: req['user'].sub },
    });
    const channelToUpdate = await this.prisma.channel.findUnique({
      where: {
        channelName: dto.channelName,
      },
    });
    if (channelToUpdate.ownerId !== user.id)
      throw new ForbiddenException(
        'You must be the channel owner to do this operation',
      );
    if (dto.mode === ChannelMode.PROTECTED) {
      const hashPsswd = await argon.hash(dto.password);
      channelPatch['password'] = hashPsswd;
    }
    const updateChannel = await this.prisma.channel.update({
      where: { channelName: dto.channelName },
      data: channelPatch,
    });
    return updateChannel;
  }

  async leaveChannel(dto: ChannelLeaveDto, req: Request) {
    const user = await this.prisma.user.findUnique({
      where: { id: req['user'].sub },
    });
    const channelToLeave = await this.prisma.channel.findUnique({
      where: { channelName: dto.channelName },
      include: { invitedUsers: true, owner: true },
    });
    if (user.username === channelToLeave.owner.username) {
      const deletedChannel = await this.prisma.channel.delete({
        where: { channelName: dto.channelName },
      });
      this.socketEvents.deletedChannel(deletedChannel);
      return deletedChannel;
    } else {
      const updatedInvitations = channelToLeave.invitedUsers.filter(
        (invitedUser) => invitedUser.username !== user.username,
      );
      const updateChannelInvitations = await this.prisma.channel.update({
        where: { channelName: dto.channelName },
        data: { invitedUsers: { set: updatedInvitations } },
      });
      return updateChannelInvitations;
    }
  }

  isAdmin(adminUsers: User[], targetUser: User): boolean {
    for (let i = 0; i < adminUsers.length; i++) {
      if (adminUsers[i].username === targetUser.username) return true;
    }
    return false;
  }

  async updateChannel(req: Request, dto: ChannelUpdateDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: req['user'].sub },
      });
      if (!user) throw new NotFoundException('Invalid user');
      const targetChannel = await this.prisma.channel.findUnique({
        where: { channelName: dto.channelName },
        include: { adminUsers: true },
      });
      if (!targetChannel) throw new NotFoundException('Invalid channel');
      const targetUser = await this.prisma.user.findUnique({
        where: { username: dto.targetUser },
      });
      if (!targetUser) throw new NotFoundException('Invalid target user');
      if (targetUser.id == targetChannel.ownerId)
        throw new ForbiddenException('Target cannot be the channel owner');
      if (
        targetChannel.ownerId !== user.id &&
        !this.isAdmin(targetChannel.adminUsers, user)
      )
        throw new ForbiddenException('You must be admin to update channel');
      switch (dto.updateType) {
        case UpdateType.INVITE_PLAYER:
          this.setPlayerInvitation(
            targetUser,
            dto.channelName,
            UpdateType.INVITE_PLAYER,
          );
          break;
        case UpdateType.KICK_PLAYER:
          this.setPlayerInvitation(
            targetUser,
            dto.channelName,
            UpdateType.KICK_PLAYER,
          );
          break;
        case UpdateType.SET_PLAYER_ADMIN:
          this.setPlayerAdmin(
            targetUser,
            dto.channelName,
            UpdateType.SET_PLAYER_ADMIN,
          );
          break;
        case UpdateType.UNSET_PLAYER_ADMIN:
          this.setPlayerAdmin(
            targetUser,
            dto.channelName,
            UpdateType.UNSET_PLAYER_ADMIN,
          );
          break;
        case UpdateType.BAN_PLAYER:
          this.setBannedUsers(
            targetUser,
            dto.channelName,
            UpdateType.BAN_PLAYER,
          );
          break;
        case UpdateType.DEBAN_PLAYER:
          this.setBannedUsers(
            targetUser,
            dto.channelName,
            UpdateType.DEBAN_PLAYER,
          );
          break;
      }
    } catch (error) {
      throw error;
    }
  }

  //Ban or Deban user from channel
  //
  async setBannedUsers(targetUser: any, channelName: string, mode: UpdateType) {
    try {
      let updatedBans: any[];
      const targetChannel = await this.prisma.channel.findUnique({
        where: { channelName: channelName },
        include: { banUsers: true, adminUsers: true },
      });
      if (
        this.isAdmin(targetChannel.adminUsers, targetUser) ||
        targetChannel.ownerId === targetUser.id
      )
        return;
      if (mode === UpdateType.BAN_PLAYER) {
        updatedBans = [...targetChannel.banUsers, targetUser];
      } else {
        //DEBAN_PLAYER
        updatedBans = targetChannel.banUsers.filter(
          (banUser) => banUser.username !== targetUser.username,
        );
      }
      const updateChannelAdmins = await this.prisma.channel.update({
        where: { channelName: channelName },
        data: { banUsers: { set: updatedBans } },
      });
      return updateChannelAdmins;
    } catch (error) {
      throw error;
    }
  }

  //Add or Remove user from channel Administators
  //
  async setPlayerAdmin(targetUser: any, channelName: string, mode: UpdateType) {
    let updatedAdmins: any[];

    const targetChannel = await this.prisma.channel.findUnique({
      where: { channelName: channelName },
      include: { adminUsers: true },
    });
    if (mode === UpdateType.SET_PLAYER_ADMIN) {
      updatedAdmins = [...targetChannel.adminUsers, targetUser];
    } else {
      //REMOVE ADMIN
      updatedAdmins = targetChannel.adminUsers.filter(
        (adminUser) => adminUser.username !== targetUser.username,
      );
    }
    const updateChannelAdmins = await this.prisma.channel.update({
      where: { channelName: channelName },
      data: { adminUsers: { set: updatedAdmins } },
    });
    return updateChannelAdmins;
  }

  //Add or Remove user invitation to channel
  //
  async setPlayerInvitation(
    targetUser: any,
    channelName: string,
    mode: UpdateType,
  ) {
    let updatedInvitations: any[];

    const targetChannel = await this.prisma.channel.findUnique({
      where: { channelName: channelName },
      include: { invitedUsers: true },
    });
    if (targetChannel?.mode !== ChannelMode.PRIVATE)
      throw new ForbiddenException(
        'Invitations only works with private channel',
      );
    if (mode === UpdateType.INVITE_PLAYER) {
      updatedInvitations = [...targetChannel.invitedUsers, targetUser];
    } else {
      //KICK_PLAYER
      updatedInvitations = targetChannel.invitedUsers.filter(
        (invitedUser) => invitedUser.username !== targetUser.username,
      );
    }
    const updateChannelInvitations = await this.prisma.channel.update({
      where: { channelName: channelName },
      data: { invitedUsers: { set: updatedInvitations } },
    });
    return updateChannelInvitations;
  }

  async getChannelInfos(channelName: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { channelName: channelName },
      include: {
        owner: true,
        invitedUsers: true,
        adminUsers: true,
        banUsers: true,
      },
    });
    if (!channel) throw new ForbiddenException('Channel not found');
    return channel;
  }

  async getAllChannels() {
    const channels = await this.prisma.channel.findMany({
      include: { messages: true },
    });
    const channelsGroupedByMode = {
      publics: channels.filter(
        (channel) => channel.mode === ChannelMode.PUBLIC,
      ),
      privates: channels.filter(
        (channel) => channel.mode === ChannelMode.PRIVATE,
      ),
      protecteds: channels.filter(
        (channel) => channel.mode === ChannelMode.PROTECTED,
      ),
    };
    return channelsGroupedByMode;
  }

  async getAllMessageFromChannelName(
    channelName: string,
    isPrivMessage: boolean,
  ) {
    if (!isPrivMessage) {
      const channel = await this.prisma.channel.findUnique({
        where: { channelName: channelName },
      });
      if (!channel) throw new ForbiddenException('Channel not found.');
      const allMessages = await this.prisma.message.findMany({
        where: { channelId: channel.id, isPrivMessage: false },
        include: { sender: true, Channel: true },
      });
      allMessages.forEach((message) => {
        delete message.sender.hash;
      });
      return allMessages;
    }
    return undefined;
  }

  async getAuthorization(dto: ChannelJoinDto, req: any) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: req.user.sub },
      });
      if (!user) throw new ForbiddenException('User not found.');
      const channel = await this.prisma.channel.findUnique({
        where: { channelName: dto.channelName },
        include: { invitedUsers: true, banUsers: true },
      });
      if (!channel) throw new ForbiddenException('Channel not found.');
      if (
        channel.banUsers.find((banUser) => banUser.username === user.username)
      )
        return {
          authorization: false,
          reason: 'You are banned from this channel',
        };
      switch (channel.mode) {
        case 'PUBLIC':
          return { authorization: true };
        case 'PRIVATE':
          if (channel.ownerId === user.id) return { authorization: true };
          if (
            channel.invitedUsers.find(
              (invitedUser) => invitedUser.username === user.username,
            )
          )
            return { authorization: true };
          return { authorization: false, reason: 'Invitation needed' };
        case 'PROTECTED':
          try {
            const verified = await argon.verify(channel.password, dto.password);
            if (!verified) throw new ForbiddenException('Invalid password');
          } catch (error) {
            return { authorization: false, reason: error.message };
          }
          return { authorization: true };
      }
    } catch (error) {
      return error;
    }
  }

  async deleteChannel(req: any, channelName: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: req.user.sub },
        include: { channelsOwned: true },
      });
      if (!user) throw new ForbiddenException('User not found.');
      const isOwner = await this.prisma.channel.findFirst({
        where: { ownerId: user.id },
      });
      if (!isOwner)
        throw new ForbiddenException('Your not owner of this channel.');
      const deletedChannel = await this.prisma.channel.delete({
        where: { channelName: channelName },
      });
      this.socketEvents.deletedChannel(deletedChannel);
      return deletedChannel;
    } catch (error) {
      return error;
    }
  }
}
