-- AlterTable
ALTER TABLE "users" ADD COLUMN     "channelId" INTEGER;

-- CreateTable
CREATE TABLE "_Administrators" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_Bans" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Administrators_AB_unique" ON "_Administrators"("A", "B");

-- CreateIndex
CREATE INDEX "_Administrators_B_index" ON "_Administrators"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Bans_AB_unique" ON "_Bans"("A", "B");

-- CreateIndex
CREATE INDEX "_Bans_B_index" ON "_Bans"("B");

-- AddForeignKey
ALTER TABLE "_Administrators" ADD CONSTRAINT "_Administrators_A_fkey" FOREIGN KEY ("A") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Administrators" ADD CONSTRAINT "_Administrators_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Bans" ADD CONSTRAINT "_Bans_A_fkey" FOREIGN KEY ("A") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Bans" ADD CONSTRAINT "_Bans_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
