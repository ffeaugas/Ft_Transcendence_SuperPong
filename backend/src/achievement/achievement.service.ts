import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AchievementService {
  constructor(private prisma: PrismaService) {}

  async getAllAchievements() {
    const achievements = await this.prisma.achievement.findMany();
    return achievements;
  }

  async getUserAchievements(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) throw new ForbiddenException('User not found.');
    const profile = await this.prisma.profile.findUnique({
      where: { userId: user.id },
      include: { achievements: true },
    });
    if (!profile) throw new ForbiddenException('Profile not found');
    return profile.achievements;
  }
}
