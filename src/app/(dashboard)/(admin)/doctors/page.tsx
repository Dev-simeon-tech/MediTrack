import prisma from "@/lib/prisma";
import {
  DoctorsPage,
  type DoctorDirectoryRecord,
} from "@/modules/admin/pages/DoctorsPage";

export default async function Doctors() {
  const users = await prisma.user.findMany({
    where: { role: "DOCTOR" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      mustChangePassword: true,
      createdAt: true,
      doctorProfile: {
        select: {
          phone: true,
          medicalLicenseNo: true,
          specialization: true,
          dateOfBirth: true,
          gender: true,
          assignedUnit: true,
        },
      },
    },
  });

  const doctors: DoctorDirectoryRecord[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    mustChangePassword: user.mustChangePassword,
    createdAt: user.createdAt.toISOString(),
    profile: user.doctorProfile
      ? {
          ...user.doctorProfile,
          dateOfBirth: user.doctorProfile.dateOfBirth?.toISOString() ?? null,
        }
      : null,
  }));

  return <DoctorsPage doctors={doctors} />;
}
