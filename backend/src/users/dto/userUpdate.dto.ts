import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserUpdateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'oldUername' })
  oldUsername: string;
  @IsString()
  @MaxLength(12, {
    message: 'New username should be max 12 characters. ',
  })
  @MinLength(3, {
    message: 'New username  should be at least 3 characters long. ',
  })
  @Matches(RegExp('^[a-zA-Z0-9\\-]+$'), {
    message: 'New username should be alpha-numeric. ',
  })
  @IsNotEmpty()
  @IsAlphanumeric()
  @ApiProperty({ description: 'newUsername' })
  newUsername: string;
}
