import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

type Profile = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  bio: string;
  winCount: number;
  loseCount: number;
  profilePicture: string;
  eloMatchMaking: number;
  userId: number;
  username: string;
};

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  async getAllProfiles(): Promise<Profile[]> {
    const profiles = await this.prisma.profile.findMany();
    const profilesWithUsernames = await Promise.all(
      profiles.map(async (profile) => {
        const user = await this.prisma.user.findUnique({
          where: { id: profile.userId },
        });
        return { ...profile, username: user.username };
      }),
    );

    return profilesWithUsernames;
  }
}
