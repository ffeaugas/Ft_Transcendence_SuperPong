import { ForbiddenException, Injectable } from '@nestjs/common';
import { ChannelDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelMode, Prisma } from '@prisma/client';
import { Request } from 'express';
import { ChannelModifyDto } from './dto/channelModify.dto';
import * as argon from 'argon2';

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  private async createPublicChannel(owner: any, dto: ChannelDto) {
    return await this.prisma.channel.create({
      data: {
        ownerId: owner.id,
        channelName: dto.channelName,
        users: { connect: [owner] },
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
        users: { connect: [owner] },
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
        users: { connect: [owner] },
      },
    });
  }

  async createChannel(req: Request, dto: ChannelDto) {
    try {
      const owner = await this.prisma.user.findUnique({
        where: { username: req['user'].username },
      });
      if (!owner) throw new ForbiddenException('User not found.');
      let newChannel: any;
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
      if (error.code === 'P2002') {
        throw new ForbiddenException('Channel already exists.');
      }
      throw error;
    }
  }

  async changeChannelMode(req: Request, dto: any) {
    let updateChannel: any;
    const user = await this.prisma.user.findUnique({
      where: { username: req['user'].username },
    });
    const channelToUpdate = await this.prisma.channel.findUnique({
      where: {
        channelName: dto.channelName,
      },
    });
    if (channelToUpdate.ownerId !== user.id)
      throw new ForbiddenException("This user is not channel's owner");
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

  async addUserByUsername(channelName: string, username: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { channelName: channelName },
      include: { users: true },
    });
    if (!channel) throw new ForbiddenException('Channel not found.');
    const userToAdd = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (!userToAdd) throw new ForbiddenException('User not found.');
    const updatedUsers = [...channel.users, userToAdd];
    await this.prisma.channel.update({
      where: { channelName: channel.channelName },
      data: { users: { connect: updatedUsers } },
    });
  }

  async setChannelPassword(dto: ChannelModifyDto, req: Request) {
    const user = await this.prisma.user.findUnique({
      where: { username: req['user'].username },
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

  async getAllUsers(channelName: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { channelName: channelName },
      include: { users: true, owner: true },
    });
    if (!channel) throw new ForbiddenException('Channel not found');
    const allUsers = [...channel.users];
    allUsers.forEach((user) => {
      delete user.hash;
    });
    return allUsers;
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

  async getAllMessageFromChannelName(channelName: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { channelName: channelName },
    });
    if (!channel) throw new ForbiddenException('Channel not found.');
    const allMessages = await this.prisma.message.findMany({
      where: { channelId: channel.id },
      include: { sender: true },
    });
    allMessages.forEach((message) => {
      delete message.sender.hash;
    });
    return allMessages;
  }

  async deleteChannel(req: Request, channelName: string) {
    const user = await this.prisma.user.findUnique({
      where: { username: req['user'].username },
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
    return deletedChannel;
  }
}
