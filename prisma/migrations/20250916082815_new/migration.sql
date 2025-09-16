/*
  Warnings:

  - The `environment` column on the `keys` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "keys" DROP COLUMN "environment",
ADD COLUMN     "environment" TEXT NOT NULL DEFAULT 'production';
