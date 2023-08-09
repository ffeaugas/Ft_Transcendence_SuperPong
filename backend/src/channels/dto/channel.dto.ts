import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChannelDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the owner channel (username)' })
  ownerName: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the channel' })
  channelName: string;
}
