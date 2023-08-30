import { ApiProperty } from '@nestjs/swagger';
import { ChannelMode } from '@prisma/client';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class ChannelUpdateModeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the channel' })
  channelName: string;
  @ValidateIf((o) => o.mode === ChannelMode.PROTECTED)
  @MinLength(3, {
    message: 'Password should be at least 3 characters long. ',
  })
  @Matches(RegExp('^[a-zA-Z0-9\\-]+$'), {
    message: 'Password should be alpha-numeric. ',
  })
  password?: string;
  @IsNotEmpty()
  @ApiProperty({ description: 'Mode of the channel' })
  mode: ChannelMode;
}
