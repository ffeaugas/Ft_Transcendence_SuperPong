/*
  Warnings:

  - The values [PROTECTED_PASSWD] on the enum `ChannelMode` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ChannelMode_new" AS ENUM ('PRIVATE', 'PUBLIC', 'PROTECTED');
ALTER TABLE "channels" ALTER COLUMN "mode" DROP DEFAULT;
ALTER TABLE "channels" ALTER COLUMN "mode" TYPE "ChannelMode_new" USING ("mode"::text::"ChannelMode_new");
ALTER TYPE "ChannelMode" RENAME TO "ChannelMode_old";
ALTER TYPE "ChannelMode_new" RENAME TO "ChannelMode";
DROP TYPE "ChannelMode_old";
ALTER TABLE "channels" ALTER COLUMN "mode" SET DEFAULT 'PUBLIC';
COMMIT;
