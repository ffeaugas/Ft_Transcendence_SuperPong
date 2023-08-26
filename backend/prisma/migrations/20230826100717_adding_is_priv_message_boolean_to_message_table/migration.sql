-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "isPrivMessage" BOOLEAN,
ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
