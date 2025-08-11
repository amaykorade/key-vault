-- AlterTable
ALTER TABLE "keys" ADD COLUMN     "expiresAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "keyCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastUsageUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "projectCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "plan_limits" (
    "id" TEXT NOT NULL,
    "plan" "UserPlan" NOT NULL,
    "maxProjects" INTEGER NOT NULL DEFAULT 1,
    "maxKeysPerProject" INTEGER NOT NULL DEFAULT 5,
    "maxKeysTotal" INTEGER NOT NULL DEFAULT 5,
    "hasTeamFeatures" BOOLEAN NOT NULL DEFAULT false,
    "hasRBAC" BOOLEAN NOT NULL DEFAULT false,
    "hasExpiringSecrets" BOOLEAN NOT NULL DEFAULT false,
    "hasAPIAnalytics" BOOLEAN NOT NULL DEFAULT false,
    "hasEmailSupport" BOOLEAN NOT NULL DEFAULT false,
    "hasPrioritySupport" BOOLEAN NOT NULL DEFAULT false,
    "price" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plan_limits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plan_limits_plan_key" ON "plan_limits"("plan");
