import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AchievementService {
  constructor(private prisma: PrismaService) {}

  async getAllAchievements() {
    const achievements = await this.prisma.achievement.findMany();
    return achievements;
  }
}
