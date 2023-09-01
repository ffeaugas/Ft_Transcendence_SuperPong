import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserUpdateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'oldUername' })
  oldUsername: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'newUsername' })
  newUsername: string;
}
