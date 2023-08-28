/*
  Warnings:

  - You are about to drop the column `channelId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `_ChannelToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ChannelToUser" DROP CONSTRAINT "_ChannelToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChannelToUser" DROP CONSTRAINT "_ChannelToUser_B_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "channelId";

-- DropTable
DROP TABLE "_ChannelToUser";

-- CreateTable
CREATE TABLE "_Whitelist" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Whitelist_AB_unique" ON "_Whitelist"("A", "B");

-- CreateIndex
CREATE INDEX "_Whitelist_B_index" ON "_Whitelist"("B");

-- AddForeignKey
ALTER TABLE "_Whitelist" ADD CONSTRAINT "_Whitelist_A_fkey" FOREIGN KEY ("A") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Whitelist" ADD CONSTRAINT "_Whitelist_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
