import { ForbiddenException, Injectable } from '@nestjs/common';
import { MessageDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async postMessage(dto: MessageDto, req: any) {
    const sender = await this.prisma.user.findUnique({
      where: { username: req.user.username },
    });
    if (!sender) throw new ForbiddenException('Sender not found.');
    const channelToSend = await this.prisma.channel.findUnique({
      where: { channelName: dto.channelName },
    });
    if (!channelToSend) throw new ForbiddenException('Channel not found.');
    const newMessage = await this.prisma.message.create({
      data: {
        senderId: sender.id,
        content: dto.content,
        channelId: channelToSend.id,
      },
    });
    return newMessage;
  }
}
