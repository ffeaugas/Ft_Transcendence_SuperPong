import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChannelJoinDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the channel' })
  channelName: string;
}
