import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { UsersService } from 'src/users/users.service';
import { User2Fa } from 'src/users/dto/user2Fa.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
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
  async generateOTP(@Body() dto: GenOTPDTO) {}

  @Post('verif-otp')
  async verifyOTP(@Body() dto: VerifOTPDTO) {}

  @Post('validate-otp')
  async validateOTP(@Body() dto: ValidateOTPDTO) {}

  @Post('disable-otp')
  async disableOTP(@Body() dto: disableOTPDTO) {}
}
