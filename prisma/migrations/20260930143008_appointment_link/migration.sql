/*
  Warnings:

  - A unique constraint covering the columns `[appointmentId]` on the table `Encounter` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Encounter" ADD COLUMN     "appointmentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Encounter_appointmentId_key" ON "Encounter"("appointmentId");

-- AddForeignKey
ALTER TABLE "Encounter" ADD CONSTRAINT "Encounter_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
