import { ApiProperty } from '@nestjs/swagger';
import { ChannelMode } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChannelModifyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the channel' })
  channelName: string;
  @IsString()
  @ApiProperty({ description: 'Password of the channel' })
  password?: string;
  @IsNotEmpty()
  @ApiProperty({ description: 'Mode of the channel' })
  mode: ChannelMode;
}
