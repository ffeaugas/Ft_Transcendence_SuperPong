import { Prisma } from '@prisma/client';

export class Profile implements Prisma.ProfileCreateInput {
  id: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  bio: string;
  winCount?: number;
  loseCount?: number;
  profilePicture?: string;
  eloMatchMaking?: number;
  user: Prisma.UserCreateNestedOneWithoutProfileInput;
}
