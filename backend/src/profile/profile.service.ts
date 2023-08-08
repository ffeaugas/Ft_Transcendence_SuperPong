import { Body, ForbiddenException, Injectable } from '@nestjs/common';
import { Profile } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileDto } from './dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProfiles(): Promise<Profile[]> {
    return await this.prisma.profile.findMany();
  }

  async getProfileByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) throw new ForbiddenException('This profile did not exist');
    const profile = await this.prisma.profile.findUnique({
      where: { userId: user.id },
    });
    if (!profile) throw new ForbiddenException('This profile did not exist');
    return profile;
  }

  async getProfileById(uid: number) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId: uid },
    });
    if (!profile) throw new ForbiddenException('This profile did not exist');
    return profile;
  }

  async updateBioProfile(user: string, dto: ProfileDto) {
    const userFounded = await this.prisma.user.findUnique({
      where: { username: user },
    });
    return await this.prisma.profile.update({
      where: { userId: userFounded.id },
      data: { bio: dto.bio },
    });
  }

  async deleteProfileByUsername(user: string) {
    const userFounded = await this.prisma.user.findUnique({
      where: { username: user },
    });
    return await this.prisma.profile.delete({
      where: { userId: userFounded.id },
    });
  }

  async deleteProfileById(id: number) {
    return await this.prisma.profile.delete({
      where: { userId: +id },
    });
  }

  async deleteAllProfiles() {
    return await this.prisma.profile.deleteMany();
  }
}
