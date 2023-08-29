import { ForbiddenException, Injectable } from '@nestjs/common';
import { ChannelDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelMode } from '@prisma/client';
import { Request } from 'express';
import { ChannelModifyDto } from './dto/channelModify.dto';
import * as argon from 'argon2';
import { SocketEvents } from 'src/socket/socketEvents';
import { ChannelJoinDto } from './dto/channelJoin.dto';
import { ChannelInvitationDto } from './dto/channelInvitation.dto';
import { ChannelKickDto } from './dto/channelKick.dto ';

@Injectable()
export class ChannelsService {
  constructor(
    private prisma: PrismaService,
    private readonly socketEvents: SocketEvents,
  ) {}

  private async createPublicChannel(owner: any, dto: ChannelDto) {
    return await this.prisma.channel.create({
      data: {
        ownerId: owner.id,
        channelName: dto.channelName,
        password: '',
        mode: ChannelMode.PUBLIC,
      },
    });
  }

  private async createPrivateChannel(owner: any, dto: ChannelDto) {
    return await this.prisma.channel.create({
      data: {
        ownerId: owner.id,
        channelName: dto.channelName,
        password: '',
        mode: ChannelMode.PRIVATE,
      },
    });
  }

  private async createProtectedChannel(owner: any, dto: ChannelDto) {
    const hashPasswd = await argon.hash(dto.password);
    return await this.prisma.channel.create({
      data: {
        ownerId: owner.id,
        channelName: dto.channelName,
        mode: ChannelMode.PROTECTED,
        password: hashPasswd,
      },
    });
  }

  async createChannel(req: Request, dto: ChannelDto) {
    try {
      const owner = await this.prisma.user.findUnique({
        where: { id: req['user'].sub },
      });
      if (!owner) throw new ForbiddenException('User not found.');
      let newChannel = await this.prisma.channel.findUnique({
        where: { channelName: dto.channelName },
      });
      if (newChannel) throw new ForbiddenException('Channel already exists');
      // let newChannel: any;
      switch (dto.mode) {
        case 'PUBLIC':
          newChannel = await this.createPublicChannel(owner, dto);
          break;
        case 'PROTECTED':
          newChannel = await this.createProtectedChannel(owner, dto);
          break;
        case 'PRIVATE':
          newChannel = await this.createPrivateChannel(owner, dto);
          break;
      }
      return newChannel;
    } catch (error) {
      throw error;
    }
  }

  async changeChannelMode(req: Request, dto: any) {
    let updateChannel: any;
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
    if (dto.mode === ChannelMode.PRIVATE) {
      updateChannel = await this.prisma.channel.update({
        where: { channelName: dto.channelName },
        data: { mode: ChannelMode.PRIVATE },
      });
    } else if (dto.mode === ChannelMode.PUBLIC) {
      updateChannel = await this.prisma.channel.update({
        where: { channelName: dto.channelName },
        data: { mode: ChannelMode.PUBLIC },
      });
    } else if (dto.mode === ChannelMode.PROTECTED) {
      const hashPsswd = await argon.hash(dto.password);
      updateChannel = await this.prisma.channel.update({
        where: { channelName: dto.channelName },
        data: { mode: ChannelMode.PROTECTED, password: hashPsswd },
      });
    } else {
      throw new ForbiddenException('mode not valid.');
    }
    return updateChannel;
  }

  async inviteInChannel(req: Request, dto: ChannelInvitationDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: req['user'].sub },
    });
    const channelToInviteIn = await this.prisma.channel.findUnique({
      where: { channelName: dto.channelName },
      include: { invitedUsers: true },
    });
    const userToInvite = await this.prisma.user.findUnique({
      where: { username: dto.userToInvite },
    });
    if (channelToInviteIn.ownerId !== user.id)
      throw new ForbiddenException(
        'You must be the channel owner to invite anyone',
      );
    if (channelToInviteIn.mode !== ChannelMode.PRIVATE)
      throw new ForbiddenException(
        'Invitations only works with private channel',
      );
    const updatedInvitations = [
      ...channelToInviteIn.invitedUsers,
      userToInvite,
    ];
    const updateChannelInvitations = await this.prisma.channel.update({
      where: { channelName: dto.channelName },
      data: { invitedUsers: { connect: updatedInvitations } },
    });
    return updateChannelInvitations;
  }

  async kickFromChannel(req: Request, dto: ChannelKickDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: req['user'].sub },
    });
    const channelToKickFrom = await this.prisma.channel.findUnique({
      where: { channelName: dto.channelName },
      include: { invitedUsers: true },
    });
    const userToKick = await this.prisma.user.findUnique({
      where: { username: dto.userToKick },
    });
    if (!userToKick) throw new ForbiddenException("User doesn't exist");
    if (channelToKickFrom.ownerId !== user.id)
      throw new ForbiddenException(
        'You must be the channel owner to kick someone',
      );
    if (channelToKickFrom.mode !== ChannelMode.PRIVATE)
      throw new ForbiddenException('Kick only works with private channel');
    console.log('BEFORE KICK : ', channelToKickFrom.invitedUsers);
    const updatedInvitations = channelToKickFrom.invitedUsers.filter(
      (invitedUser) => invitedUser.username !== dto.userToKick,
    );
    console.log('AFTER KICK : ', updatedInvitations);
    const updateChannelInvitations = await this.prisma.channel.update({
      where: { channelName: dto.channelName },
      data: { invitedUsers: { set: updatedInvitations } },
    });
    return updateChannelInvitations;
  }

  async setChannelPassword(dto: ChannelModifyDto, req: Request) {
    const user = await this.prisma.user.findUnique({
      where: { id: req['user'].sub },
    });
    const channelToUpdate = await this.prisma.channel.findFirst({
      where: {
        channelName: dto.channelName,
        ownerId: user.id,
      },
    });
    if (!channelToUpdate)
      throw new ForbiddenException("This user is not channel's owner");
    const hashPasswd = await argon.hash(dto.password);
    const updatedChannel = await this.prisma.channel.update({
      where: { channelName: dto.channelName, mode: ChannelMode.PRIVATE },
      data: { password: hashPasswd },
    });
    delete updatedChannel.password;
    return updatedChannel;
  }

  async isOwner(channelName: string, userId: number) {
    const channel = await this.prisma.channel.findUnique({
      where: { channelName: channelName },
    });
    if (!channel) throw new ForbiddenException('Channel not found');
    return userId == channel.ownerId;
  }

  async getAllPublic() {
    const publicChannels = await this.prisma.channel.findMany({
      where: { mode: ChannelMode.PUBLIC },
      include: { messages: true },
    });
    return publicChannels;
  }

  async getAllChannels() {
    const channels = {
      publics: await this.prisma.channel.findMany({
        where: { mode: ChannelMode.PUBLIC },
        include: { messages: true },
      }),
      privates: await this.prisma.channel.findMany({
        where: { mode: ChannelMode.PRIVATE },
        include: { messages: true },
      }),
      protecteds: await this.prisma.channel.findMany({
        where: { mode: ChannelMode.PROTECTED },
        include: { messages: true },
      }),
    };
    return channels;
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

  async getInvitedUsers(channelName: string, req: Request) {
    const user = await this.prisma.user.findUnique({
      where: { id: req['user'].sub },
    });
    if (!user) throw new ForbiddenException('User not found.');
    const channel = await this.prisma.channel.findUnique({
      where: { channelName: channelName },
      include: { invitedUsers: true },
    });
    if (!channel) throw new ForbiddenException('Channel not found.');
    if (channel.ownerId !== user.id)
      throw new ForbiddenException('User is not channel owner');
    return channel.invitedUsers;
  }

  async getAuthorization(dto: ChannelJoinDto, req: any) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: req.user.sub },
      });
      if (!user) throw new ForbiddenException('User not found.');
      const channel = await this.prisma.channel.findUnique({
        where: { channelName: dto.channelName },
        include: { invitedUsers: true },
      });
      if (!channel) throw new ForbiddenException('Channel not found.');
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
