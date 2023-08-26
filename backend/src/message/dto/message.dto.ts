import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class MessageDto {
  @IsBoolean()
  @ApiProperty({ description: 'Is it a private message ?' })
  isPrivMessage: boolean;
  @IsString()
  @ApiProperty({ description: 'Channel name' })
  channelName?: string;
  @IsString()
  @ApiProperty({ description: 'Receiver name' })
  receiver?: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Message content' })
  content: string;
}
