import { ApiProperty } from '@nestjs/swagger';
import { ChannelMode } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChannelDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the channel' })
  channelName: string;
  @IsString()
  password?: string;
  @IsString()
  mode?: string;
}
