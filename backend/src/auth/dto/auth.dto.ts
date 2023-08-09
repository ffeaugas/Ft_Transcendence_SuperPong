import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Username' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Password' })
  password: string;
}
