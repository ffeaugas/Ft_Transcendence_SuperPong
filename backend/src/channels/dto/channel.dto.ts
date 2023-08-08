import { IsNotEmpty, IsString } from 'class-validator';

export class ChannelDto {
  @IsString()
  @IsNotEmpty()
  ownerName: string;
  @IsString()
  @IsNotEmpty()
  channelName: string;
}
