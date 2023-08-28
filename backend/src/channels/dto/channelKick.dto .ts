import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChannelKickDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the channel' })
  channelName: string;
  @IsString({
    message: 'Kicked user must be a string ',
  })
  @ApiProperty({ description: 'User kicked from the channel' })
  userToKick?: string;
}
