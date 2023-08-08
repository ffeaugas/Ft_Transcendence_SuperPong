/*
  Warnings:

  - Added the required column `channelName` to the `channels` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "channels" ADD COLUMN     "channelName" TEXT NOT NULL;
