import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Login' })
  login: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Password' })
  password: string;
}

export class VerifOTPDTO {
  @IsNotEmpty()
  TwoFaCode: string;
  @IsNotEmpty()
  TokenTmp: string;
}

export class ValidateOTPDTO {
  @IsNotEmpty()
  TwoFaCode: string;
}

export class DisableOTPDTO {}
