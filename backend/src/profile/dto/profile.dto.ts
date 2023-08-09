import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ProfileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Profile s username' })
  username: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Profile s biography' })
  bio: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Profile s user picture' })
  profilePicture: string;
}
