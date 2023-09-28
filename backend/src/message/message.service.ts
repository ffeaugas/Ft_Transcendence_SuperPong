import { ForbiddenException, Injectable } from '@nestjs/common';
import { MessageDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketEvents } from 'src/socket/socketEvents';
import { Channel, User } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(
    private prisma: PrismaService,
    private readonly socketGateway: SocketEvents,
  ) {}

  async isMuted(sender: User, channelToSend: Channel): Promise<boolean> {
    const userMutedOnChannel = await this.prisma.mute.findMany({
      where: { channelId: channelToSend.id, mutedPlayerId: sender.id },
    });
    if (userMutedOnChannel.length === 0) return false;
    const date = new Date();
    if (
      (date.getTime() -
        userMutedOnChannel[userMutedOnChannel.length - 1].updatedAt.getTime()) /
        60000 >
      1
    ) {
      const deleteMuted = await this.prisma.mute.deleteMany({
        where: { channelId: channelToSend.id, mutedPlayerId: sender.id },
      });
      return false;
    }
    return true;
  }

  async postMessage(dto: MessageDto, req: any) {
    const sender = await this.prisma.user.findUnique({
      where: { id: req.user.sub },
    });
    if (!sender) throw new ForbiddenException('Sender not found.');
    const newMessageDatas = {
      senderId: sender.id,
      content: dto.content,
    };
    if (!dto.isPrivMessage) {
      const channelToSend = await this.prisma.channel.findUnique({
        where: { channelName: dto.channelName },
      });
      if (!channelToSend) {
        throw new ForbiddenException('Channel not found.');
      }
      (newMessageDatas['isPrivMessage'] = false),
        (newMessageDatas['channelId'] = channelToSend.id);
      const muted = await this.isMuted(sender, channelToSend);
      if (muted) throw new ForbiddenException(`You are muted on this channel`);
    } else {
      const userToSend = await this.prisma.user.findUnique({
        where: { username: dto.receiver },
      });
      if (!userToSend) throw new ForbiddenException('Channel not found.');
      (newMessageDatas['isPrivMessage'] = true),
        (newMessageDatas['receiverId'] = userToSend.id);
    }
    const newMessage = await this.prisma.message.create({
      data: newMessageDatas,
      include: { sender: true, Channel: true, receiver: true },
    });
    this.socketGateway.sendMessage(newMessage);
    if (
      newMessage.content === 'Bonjour' &&
      newMessage.Channel.channelName === 'General'
    ) {
      const user = await this.prisma.user.findUnique({
        where: { id: req.user.sub },
      });
      const achievement = await this.prisma.achievement.findUnique({
        where: { title: 'Type sympa' },
      });
      const updatedAchievement = await this.prisma.profile.update({
        where: { userId: user.id },
        data: { achievements: { connect: achievement } },
      });
    }
    return newMessage;
  }

  async getPrivMessage(username: string, req: any) {
    const sender = await this.prisma.user.findUnique({
      where: { id: req.user.sub },
    });
    if (!sender) throw new ForbiddenException('Sender not found.');
    const userToSend = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (!userToSend) throw new ForbiddenException('Receiver not found.');
    const messagesSent = await this.prisma.message.findMany({
      where: { senderId: sender.id, receiverId: userToSend.id },
      include: { sender: true },
    });
    const messagesReceived = await this.prisma.message.findMany({
      where: { senderId: userToSend.id, receiverId: sender.id },
      include: { sender: true },
    });
    const messages = [...messagesSent, ...messagesReceived];

    //Sort messages by date
    const sortedMessages = messages.sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );
    return sortedMessages;
  }
}
