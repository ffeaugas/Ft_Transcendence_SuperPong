/*
  Warnings:

  - A unique constraint covering the columns `[tokenTmp]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_tokenTmp_key" ON "users"("tokenTmp");
