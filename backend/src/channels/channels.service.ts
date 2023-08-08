import { Injectable, NotFoundException } from '@nestjs/common';
import { ChannelDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

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
    if (!owner) throw new NotFoundException('User not found.');
    const newChannel = await this.prisma.channel.create({
      data: {
        ownerId: owner.id,
        channelName: dto.channelName,
        users: { connect: [owner] },
      },
    });
    return newChannel;
  }

  async addUserByUsername(channelName: string, username: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { channelName: channelName },
      include: { users: true },
    });
    if (!channel) throw new NotFoundException('Channel not found.');
    const userToAdd = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (!userToAdd) throw new NotFoundException('User not found.');
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
    if (!channel) throw new NotFoundException('Channel not found');
    const allUsers = [...channel.users];
    allUsers.forEach((user) => {
      delete user.hash;
    });
    return allUsers;
  }
}
