import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'username' })
  username: string;
}

export class UsernameUpdateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'oldUername' })
  oldUsername: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'newUsername' })
  newUsername: string;
}
