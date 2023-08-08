import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: AuthDto) {
    return await this.authService.login(dto);
  }

  @Post('register')
  async register(@Body() dto: AuthDto) {
    return await this.authService.register(dto);
  }
}
