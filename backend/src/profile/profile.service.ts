import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { Profile } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileBioUpdateDto } from './dto';
import * as fs from 'node:fs';
import { join } from 'path';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProfiles(): Promise<Profile[]> {
    return await this.prisma.profile.findMany();
  }

  async uploadFile(req: any, file: any) {
    const maxSize = 5 * 1024 * 1024;
    if (!file && file.size > maxSize)
      return new HttpException('File size exceeds the limit of 5MB.', 401);
    const user = await this.prisma.profile.findUnique({
      where: { userId: req.user.sub },
    });
    const pathOldPP = `./uploads/avatar/${user.profilePicture}`;
    fs.unlink(pathOldPP, (err) => {
      if (err) return console.log(err);
      console.log('File deleted successfully');
    });
    await this.prisma.profile.update({
      where: { userId: req.user.sub },
      data: { profilePicture: file.filename },
    });
    return { message: 'File uploaded successfully', filename: file.filename };
  }

  async getProfileByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) throw new ForbiddenException('This profile did not exist');
    const profile = await this.prisma.profile.findUnique({
      where: { userId: user.id },
      include: { user: true },
    });
    if (!profile) throw new ForbiddenException('This profile did not exist');
    return profile;
  }

  async getProfileById(uid: number) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId: uid },
      include: { user: true },
    });
    if (!profile) throw new ForbiddenException('This profile did not exist');
    return profile;
  }

  private async saveImage(image: Express.Multer.File): Promise<string> {
    const imageName = `${Date.now()}-${image.originalname}`;
    const imagePath = join(__dirname, '..', 'uploads', 'avatar', imageName);

    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(imagePath);
      writer.on('finish', () => resolve(imageName));
      writer.on('error', reject);
      image.stream.pipe(writer);
    });
  }

  async updateProfileBio(dto: ProfileBioUpdateDto) {
    const userFounded = await this.prisma.user.findUnique({
      where: { username: dto.username },
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
