import { Prisma, Role } from '@prisma/client';

export class Users implements Prisma.UserCreateInput {
  hash: string;
  user42?: boolean;
  channelId?: number;
  isTwoFaEnabled?: boolean;
  TwoFaSecret?: string;
  id: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  lastConnexionPing?: number;
  role?: Role;
  login: string;
  username: string;
}
