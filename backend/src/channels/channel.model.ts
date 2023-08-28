import { $Enums, Prisma } from '@prisma/client';

export class Channel implements Prisma.ChannelCreateInput {
  createdAt?: string | Date;
  updatedAt?: string | Date;
  channelName: string;
  password?: string;
  mode?: $Enums.ChannelMode;
  owner: Prisma.UserCreateNestedOneWithoutChannelsOwnedInput;
  messages?: Prisma.MessageCreateNestedManyWithoutChannelInput;
}
