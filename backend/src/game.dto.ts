import { ApiProperty } from '@nestjs/swagger';
import { ChannelMode } from '@prisma/client';
import {
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class GameDto {
  @IsString()
  winner: string;
  @IsString()
  looser: string;
}
