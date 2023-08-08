import { IsNotEmpty, IsString } from 'class-validator';

export class ProfileDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsNotEmpty()
  bio: string;
  @IsString()
  @IsNotEmpty()
  profilePicture: string;
}
