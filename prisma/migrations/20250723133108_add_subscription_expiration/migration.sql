/*
  Warnings:

  - Added the required column `subscriptionEndDate` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "subscriptionEndDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "subscriptionStartDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "subscriptionExpiresAt" TIMESTAMP(3);
