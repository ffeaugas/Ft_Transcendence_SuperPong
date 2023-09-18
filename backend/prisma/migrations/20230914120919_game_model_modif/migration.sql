/*
  Warnings:

  - You are about to drop the column `looser` on the `games` table. All the data in the column will be lost.
  - You are about to drop the column `winner` on the `games` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "games" DROP COLUMN "looser",
DROP COLUMN "winner",
ADD COLUMN     "player1Id" INTEGER,
ADD COLUMN     "player2Id" INTEGER;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
