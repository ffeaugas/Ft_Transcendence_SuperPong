import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ProfileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'username' })
  username: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'bio' })
  bio: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'profilePicture' })
  profilePicture: string;
}

export class ProfileBioUpdateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'username' })
  username: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'bio' })
  bio: string;
}
