-- CreateEnum
CREATE TYPE "EncounterCategory" AS ENUM ('CONSULTATION', 'FOLLOW_UP', 'URGENT_TRIAGE', 'PROCEDURE');

-- AlterTable
ALTER TABLE "Encounter" ADD COLUMN     "category" "EncounterCategory" NOT NULL DEFAULT 'CONSULTATION';
