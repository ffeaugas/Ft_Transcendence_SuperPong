import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MessageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Channel name' })
  channelName: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Message content' })
  content: string;
}
