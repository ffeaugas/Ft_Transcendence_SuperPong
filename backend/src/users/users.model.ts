import { Prisma, Role } from '@prisma/client';

export class Users implements Prisma.UserCreateInput {
  id: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  user42: boolean;
  role: Role;
  username: string;
  hash: string;
  profile?: Prisma.ProfileCreateNestedOneWithoutUserInput;
}
