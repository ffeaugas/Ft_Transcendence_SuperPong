/*
  Warnings:

  - You are about to drop the column `TwoFaSecret` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isTwoFaEnabled` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "TwoFaSecret",
DROP COLUMN "isTwoFaEnabled",
ADD COLUMN     "otpEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otpValidated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otp_secret" TEXT,
ADD COLUMN     "otp_url" TEXT;
