import { ForbiddenException, Injectable } from '@nestjs/common';
import { MessageDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketEvents } from 'src/socket/socketEvents';

@Injectable()
export class MessageService {
  constructor(
    private prisma: PrismaService,
    private readonly socketGateway: SocketEvents,
  ) {}

  async postMessage(dto: MessageDto, req: any) {
    const sender = await this.prisma.user.findUnique({
      where: { id: req.user.sub },
    });
    if (!sender) throw new ForbiddenException('Sender not found.');
    if (!dto.isPrivMessage) {
      const channelToSend = await this.prisma.channel.findUnique({
        where: { channelName: dto.channelName },
      });
      if (!channelToSend) throw new ForbiddenException('Channel not found.');
      const newMessage = await this.prisma.message.create({
        data: {
          isPrivMessage: false,
          senderId: sender.id,
          content: dto.content,
          channelId: channelToSend.id,
        },
        include: { sender: true },
      });
      this.socketGateway.sendMessage(newMessage);
      return newMessage;
    } else {
      const userToSend = await this.prisma.user.findUnique({
        where: { username: dto.receiver },
      });
      if (!userToSend) throw new ForbiddenException('Channel not found.');
      const newMessage = await this.prisma.message.create({
        data: {
          isPrivMessage: true,
          senderId: sender.id,
          content: dto.content,
          receiverId: userToSend.id,
        },
        include: { sender: true },
      });
      this.socketGateway.sendMessage(newMessage);
      return newMessage;
    }
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
    //ADD A STEP TO SORT MESSAGES BY DATE
    return [...messagesSent, ...messagesReceived];
  }
}
