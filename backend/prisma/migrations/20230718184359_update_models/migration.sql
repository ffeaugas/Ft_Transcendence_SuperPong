/*
  Warnings:

  - You are about to drop the column `firstName` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hash]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_email_key";

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "username",
ADD COLUMN     "loseCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "winCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "email",
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_hash_key" ON "users"("hash");
