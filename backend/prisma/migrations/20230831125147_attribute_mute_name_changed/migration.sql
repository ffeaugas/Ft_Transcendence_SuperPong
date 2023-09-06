/*
  Warnings:

  - You are about to drop the column `userId` on the `Mute` table. All the data in the column will be lost.
  - Added the required column `mutedPlayerId` to the `Mute` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Mute" DROP CONSTRAINT "Mute_userId_fkey";

-- AlterTable
ALTER TABLE "Mute" DROP COLUMN "userId",
ADD COLUMN     "mutedPlayerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Mute" ADD CONSTRAINT "Mute_mutedPlayerId_fkey" FOREIGN KEY ("mutedPlayerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
