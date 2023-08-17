import { Prisma } from '@prisma/client';

export class Achievement implements Prisma.AchievementCreateInput {
  createdAt?: string | Date;
  updatedAt?: string | Date;
  title: string;
  description: string;
  picture: string;
  rank?: number;
  user?: Prisma.ProfileCreateNestedManyWithoutAchievementsInput;
}
