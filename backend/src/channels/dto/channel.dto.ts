import { ApiProperty } from '@nestjs/swagger';
import { ChannelMode } from '@prisma/client';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class ChannelDto {
  @Matches(RegExp('^[a-zA-Z0-9]+$'), {
    message: 'Channelname should be alpha-numeric',
  })
  @IsString()
  @MaxLength(12, {
    message: 'Channelname should be max 12 characters. ',
  })
  @MinLength(3, {
    message: 'Channelname should be at least 3 characters long. ',
  })
  @ApiProperty({ description: 'Name of the channel' })
  channelName: string;
  @IsString()
  @MaxLength(12, {
    message: 'Password should be max 12 characters. ',
  })
  @ValidateIf((o) => o.mode === ChannelMode.PROTECTED)
  @MinLength(3, {
    message: 'Password should be at least 3 characters long. ',
  })
  @Matches(RegExp('^[a-zA-Z0-9\\-]+$'), {
    message: 'Password should be alpha-numeric. ',
  })
  password?: string;
  @IsString()
  mode?: ChannelMode;
}
