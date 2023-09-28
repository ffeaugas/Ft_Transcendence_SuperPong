/*
  Warnings:

  - You are about to drop the `_AchievementToProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AchievementToProfile" DROP CONSTRAINT "_AchievementToProfile_A_fkey";

-- DropForeignKey
ALTER TABLE "_AchievementToProfile" DROP CONSTRAINT "_AchievementToProfile_B_fkey";

-- DropTable
DROP TABLE "_AchievementToProfile";

-- CreateTable
CREATE TABLE "_UserAchievement" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserAchievement_AB_unique" ON "_UserAchievement"("A", "B");

-- CreateIndex
CREATE INDEX "_UserAchievement_B_index" ON "_UserAchievement"("B");

-- AddForeignKey
ALTER TABLE "_UserAchievement" ADD CONSTRAINT "_UserAchievement_A_fkey" FOREIGN KEY ("A") REFERENCES "achievements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserAchievement" ADD CONSTRAINT "_UserAchievement_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
