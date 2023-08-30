import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

enum UpdateType {
  KICK_PLAYER = 'KICK_PLAYER',
  INVITE_PLAYER = 'INVITE_PLAYER',
  SET_PLAYER_ADMIN = 'SET_PLAYER_ADMIN',
  UNSET_PLAYER_ADMIN = 'UNSET_PLAYER_ADMIN',
}

export class ChannelUpdateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the channel' })
  channelName: string;

  @IsString({
    message: 'Target user must be a string',
  })
  @ApiProperty({ description: 'Target user' })
  targetUser?: string;

  @IsString()
  @IsNotEmpty()
  updateType: UpdateType;
}
