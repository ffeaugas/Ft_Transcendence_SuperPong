import {
  Body,
  Controller,
  HttpException,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, ValidateOTPDTO, VerifOTPDTO } from './dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}

  @ApiOperation({ summary: 'login' })
  @Post('login')
  async login(@Body() dto: AuthDto) {
    return await this.authService.login(dto);
  }

  @ApiOperation({ summary: 'register' })
  @Post('register')
  async register(@Body() dto: AuthDto) {
    return await this.authService.register(dto);
  }

  @Post('gen-otp')
  async generateOTP(@Query('username') username: any) {
    return await this.authService.generateOTP(username);
  }

  @Post('verif-otp')
  async verifyOTP(
    @Query('username') username: string,
    @Body() dto: VerifOTPDTO,
  ) {
    return await this.authService.verifyOTP(username, dto);
  }

  @Post('validate-otp')
  async validateOTP(
    @Query('username') username: string,
    @Body() dto: ValidateOTPDTO,
  ) {
    return await this.authService.validateOTP(username, dto);
  }

  @Post('disable-otp')
  async disableOTP(@Query('username') username: string) {
    const user = await this.prisma.user.update({
      where: { username: username },
      data: { otp_url: '', otp_secret: '', otpEnabled: false },
    });
    delete user.hash;
    return user;
  }
}
