-- AlterTable
ALTER TABLE "users" ADD COLUMN     "TwoFaSecret" TEXT,
ADD COLUMN     "isTwoFaEnabled" BOOLEAN NOT NULL DEFAULT false;
