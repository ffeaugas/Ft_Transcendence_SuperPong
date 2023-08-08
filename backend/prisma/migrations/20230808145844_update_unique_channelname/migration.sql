/*
  Warnings:

  - A unique constraint covering the columns `[channelName]` on the table `channels` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "channels_channelName_key" ON "channels"("channelName");
