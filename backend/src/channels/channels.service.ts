import { Injectable, NotFoundException } from '@nestjs/common';
import { ChannelDto } from './dto';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChannelsService {
  constructor(
    private readonly usersService: UsersService,
    private prisma: PrismaService,
  ) {}

  async createChannel(dto: ChannelDto) {
    const owner = await this.prisma.user.findUnique({
      where: { username: dto.ownerName },
    });
    if (!owner) throw new NotFoundException('User not found.');
    const newChannel = await this.prisma.channel.create({
      data: { ownerId: owner.id, channelName: dto.channelName },
    });
    return newChannel;
  }
}
