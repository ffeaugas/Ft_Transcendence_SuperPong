/*
  Warnings:

  - You are about to drop the column `gameId` on the `users` table. All the data in the column will be lost.
  - Added the required column `player1Id` to the `games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player2Id` to the `games` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChannelMode" AS ENUM ('PRIVATE', 'PUBLIC', 'PROTECTED_PASSWD');

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_gameId_fkey";

-- DropIndex
DROP INDEX "channels_ownerId_key";

-- DropIndex
DROP INDEX "messages_senderId_key";

-- AlterTable
ALTER TABLE "channels" ADD COLUMN     "mode" "ChannelMode" NOT NULL DEFAULT 'PUBLIC';

-- AlterTable
ALTER TABLE "games" ADD COLUMN     "player1Id" INTEGER NOT NULL,
ADD COLUMN     "player2Id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "profiles" ALTER COLUMN "profilePicture" SET DEFAULT 'https://i.imgur.com/6LwIx5Q.png';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "gameId";

-- CreateTable
CREATE TABLE "_ChannelToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelToUser_AB_unique" ON "_ChannelToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelToUser_B_index" ON "_ChannelToUser"("B");

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToUser" ADD CONSTRAINT "_ChannelToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToUser" ADD CONSTRAINT "_ChannelToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
