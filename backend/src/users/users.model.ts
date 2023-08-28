import { $Enums, Prisma, Role, Status } from '@prisma/client';

export class Users implements Prisma.UserCreateInput {
  id: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  role?: Role;
  login: string;
  username: string;
  hash: string;
  status?: Status;
  user42?: boolean;
}
