import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class User2Fa {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Two factor auth token' })
  twoFactorAuthenticationCode: string;
}
