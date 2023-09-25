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

export class GenOTPDTO {
  @IsNotEmpty()
  id: string;
}

export class VerifOTPDTO {}

export class ValidateOTPDTO {}

export class DisableOTPDTO {}
