import { $Enums, Prisma, Role, Status } from '@prisma/client';

export class Users implements Prisma.UserCreateInput {
  hash: string;
  status?: $Enums.Status;
  user42?: boolean;
  channelId?: number;
  isTwoFaEnabled?: boolean;
  TwoFaSecret?: string;
  id: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  role?: Role;
  login: string;
  username: string;
}
