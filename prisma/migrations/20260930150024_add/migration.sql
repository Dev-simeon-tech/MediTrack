-- CreateEnum
CREATE TYPE "DoctorGender" AS ENUM ('MALE', 'FEMALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY');

-- CreateTable
CREATE TABLE "DoctorProfile" (
    "userId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "medicalLicenseNo" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "gender" "DoctorGender",
    "assignedUnit" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorProfile_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "DoctorProfile_medicalLicenseNo_key" ON "DoctorProfile"("medicalLicenseNo");

-- AddForeignKey
ALTER TABLE "DoctorProfile" ADD CONSTRAINT "DoctorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
