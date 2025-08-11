-- CreateEnum
CREATE TYPE "Environment" AS ENUM ('DEVELOPMENT', 'STAGING', 'TESTING', 'PRODUCTION', 'LOCAL', 'OTHER');

-- AlterTable
ALTER TABLE "keys" ADD COLUMN     "environment" "Environment" NOT NULL DEFAULT 'DEVELOPMENT';
