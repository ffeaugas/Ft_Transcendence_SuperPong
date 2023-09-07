/*
  Warnings:

  - You are about to drop the column `player1Id` on the `games` table. All the data in the column will be lost.
  - You are about to drop the column `player2Id` on the `games` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_player1Id_fkey";

-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_player2Id_fkey";

-- AlterTable
ALTER TABLE "games" DROP COLUMN "player1Id",
DROP COLUMN "player2Id";
