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

  @Post('2fa/turn-on')
  @UseGuards(AuthGuard)
  async turnOnTwoFactorAuthentication(
    @Req() request: any,
    @Body() dto: User2Fa,
  ) {
    const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
      dto.twoFactorAuthenticationCode,
      request.user,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.userService.setTwoFactorAuth(request, true);
  }

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
}
