import { ForbiddenException, Injectable } from '@nestjs/common';
import { ChannelDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { ChannelMode, Prisma } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class ChannelsService {
  constructor(
    private prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async createChannel(dto: ChannelDto) {
    const owner = await this.prisma.user.findUnique({
      where: { username: dto.ownerName },
    });
    if (!owner) throw new ForbiddenException('User not found.');
    const newChannel = await this.prisma.channel.create({
      data: {
        ownerId: owner.id,
        channelName: dto.channelName,
        users: { connect: [owner] },
      },
    });
    return newChannel;
  }

  async changeChannelMode(req: Request, channelName: string, mode: string) {
    let updateChannel: any;
    const channelOwner = await this.prisma.user.findUnique({
      where: { username: req['user'].username },
    });
    const verifyOwner = await this.prisma.channel.findUnique({
      where: {
        channelName: channelName,
        ownerId: channelOwner.id,
      },
    });
    if (!verifyOwner)
      throw new ForbiddenException("This user is not channel's owner");
    if (mode === 'private') {
      updateChannel = await this.prisma.channel.update({
        where: { channelName: channelName },
        data: { mode: ChannelMode.PRIVATE },
      });
    } else if (mode === 'public') {
      updateChannel = await this.prisma.channel.update({
        where: { channelName: channelName },
        data: { mode: ChannelMode.PUBLIC },
      });
    } else if (mode === 'invit_only') {
      updateChannel = await this.prisma.channel.update({
        where: { channelName: channelName },
        data: { mode: ChannelMode.PROTECTED_PASSWD },
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
    });
    return publicChannels;
  }
}
