import { $Enums, Prisma, Role, Status } from '@prisma/client';

export class Users implements Prisma.UserCreateInput {
  username: string;
  user42?: boolean;
  channelId?: number;
  id: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  role?: Role;
  login: string;
  hash: string;
  status?: Status;
}
