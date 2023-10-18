import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto, ValidateOTPDTO, VerifOTPDTO } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'node:fs';
import { firstValueFrom } from 'rxjs';
import * as QRCode from 'qrcode';
import * as speakeasy from 'speakeasy';

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
      this.downloadImage(
        userData.image.link,
        userData.login + '_' + +newUser.id,
      );
      const achievement = await this.prisma.achievement.findUnique({
        where: { title: 'GPU Eater' },
      });
      const updatedAchievement = await this.prisma.profile.update({
        where: { userId: newUser.id },
        data: { achievements: { connect: achievement } },
      });
    } else {
      user.login = userData.login;
      user.password = userFound.hash;
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

  async respondWithQRCode(otpauthUrl: string) {
    return await QRCode.toDataURL(otpauthUrl);
  }

  async getTwoFactorAuthenticationCode() {
    const secretCode = speakeasy.generateSecret({
      name: process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
    });
    return {
      otpauthUrl: secretCode.otpauth_url,
      base32: secretCode.base32,
    };
  }

  async verifyOTP(username: string, dto: VerifOTPDTO) {
    const user = await this.prisma.user.findFirst({
      where: { AND: [{ login: username }, { tokenTmp: dto.TokenTmp }] },
    });
    if (!user) throw new HttpException('User not found', 401);
    const verified = speakeasy.totp.verify({
      secret: user.otp_secret,
      encoding: 'base32',
      token: dto.TwoFaCode,
    });
    if (!verified) throw new HttpException('Two factor code not valid.', 401);
    const payload = {
      sub: user.id,
      login: user.login,
      role: user.role,
      otpenabled: user.otpEnabled,
      otpvalidated: user.otpValidated,
    };
    const updatedUser = await this.prisma.user.update({
      where: { login: username },
      data: { otpValidated: verified, tokenTmp: '' },
    });
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  async validateOTP(username: string, dto: ValidateOTPDTO) {
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) throw new HttpException('User not found', 401);
    const verified = speakeasy.totp.verify({
      secret: user.otp_secret,
      encoding: 'base32',
      token: dto.TwoFaCode,
    });
    console.log('valid secret: ', user.otp_secret, 'code :', dto.TwoFaCode);
    if (!verified) throw new HttpException('Two factor code not valid.', 401);
    const updatedUser = await this.prisma.user.update({
      where: { username: username },
      data: { otpEnabled: verified, otpValidated: verified },
    });
    return {
      otpValidate: updatedUser.otpValidated,
    };
  }

  async generateOTP(username: any) {
    const { otpauthUrl, base32 } = await this.getTwoFactorAuthenticationCode();
    const user = await this.prisma.user.update({
      where: { username: username },
      data: { otp_url: otpauthUrl, otp_secret: base32 },
    });
    const qrCodeDataURL = await this.respondWithQRCode(otpauthUrl);
    console.log('secret: ', user.otp_secret, otpauthUrl);
    return { urlData: qrCodeDataURL };
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
    }
    if (user.otpEnabled) {
      const tmpToken = Math.random().toString(36).slice(-32);
      await this.prisma.user.update({
        where: { login: dto.login },
        data: { tokenTmp: tmpToken },
      });
      return {
        codeRequire: true,
        tmpToken: tmpToken,
      };
    }
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }
}
