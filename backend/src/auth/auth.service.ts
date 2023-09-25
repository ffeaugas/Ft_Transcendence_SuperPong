import { ForbiddenException, Injectable, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/users.model';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'node:fs';
import { firstValueFrom } from 'rxjs';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private httpService: HttpService,
    private jwtService: JwtService,
  ) {}

  async downloadImage(picture: string, imageName: string) {
    const writer = fs.createWriteStream(`./uploads/avatar/${imageName}.jpeg`);
    const response = await this.httpService.axiosRef({
      url: picture,
      method: 'GET',
      responseType: 'stream',
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }

  async handleSuccessful42Auth(accessToken: string) {
    let isFirstConnection: boolean = false;
    const userData = await this.get42UserData(accessToken);
    const password = Math.random().toString(36).slice(-16);
    const passwordHash: string = await argon.hash(password);
    const user = new AuthDto();
    const userFound = await this.prisma.user.findUnique({
      where: { login: userData.login },
    });
    if (!userFound || !userFound.user42) {
      user.login = userData.login;
      user.password = passwordHash;
      isFirstConnection = true;
      const newUser = await this.usersService.createUser(user, true);
      await this.prisma.profile.update({
        where: { userId: newUser.id },
        data: {
          profilePicture: newUser.login + '_' + +newUser.id + '.jpeg',
        },
      });
      console.log('USERDATA : ', userData);
      this.downloadImage(
        userData.image.link,
        userData.login + '_' + +newUser.id,
      );
    } else {
      user.login = userData.login;
      user.password = userFound.hash;
      console.log(userData.email);
    }
    const res = await this.login(user);
    return [res, isFirstConnection];
  }

  async get42UserData(accessToken: string) {
    const apiUrl = 'https://api.intra.42.fr/v2/me';
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await firstValueFrom(this.httpService.get(apiUrl, config));
    return response.data;
  }

  async register(dto: AuthDto) {
    try {
      const newUser = await this.usersService.createUser(dto, false);
      if (!newUser) throw new ForbiddenException('Error when creating user.');
      return this.login(dto);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async login(dto: AuthDto) {
    const user = await this.usersService.getByUsername(dto.login);
    const payload = {
      sub: user.id,
      login: user.login,
      role: user.role,
      otpenabled: user.otpEnabled,
      otpvalidated: user.otpValidated,
    };
    if (!user.user42) {
      const verified = await argon.verify(user.hash, dto.password);
      if (!verified) throw new ForbiddenException('Bad Credentials');
    } else if (user.otpEnabled) {
      // if () {}
      // TODO VERIFY THE 2FA
    }
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
