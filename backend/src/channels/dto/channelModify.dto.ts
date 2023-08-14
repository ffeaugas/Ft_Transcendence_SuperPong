import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChannelModifyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the channel' })
  channelName: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Password of the channel' })
  password?: string;
}
