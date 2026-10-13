import PatientProfile from "@/modules/patients/pages/PatientProfile";
import prisma from "@/lib/prisma";

export default async function PatientPage({
  params,
  searchParams,
}: {
  params: Promise<{ patientId: string }>;
  searchParams: Promise<{ appointmentId?: string }>;
}) {
  const [{ patientId }, { appointmentId }] = await Promise.all([
    params,
    searchParams,
  ]);
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    include: {
      encounters: {
        orderBy: { date: "desc" },
        include: {
          doctor: { select: { id: true, name: true } },
          prescriptions: true,
        },
      },
      vitals: {
        orderBy: { date: "desc" },
      },
      documents: {
        orderBy: { uploadedAt: "desc" },
      },
      appointments: {
        orderBy: { date: "desc" },
        include: {
          doctor: { select: { id: true, name: true } },
        },
      },
    },
  });

  if (!patient) return;

  const startAppointmentId = patient.appointments.some(
    (appointment) =>
      appointment.id === appointmentId && appointment.status === "SCHEDULED",
  )
    ? appointmentId
    : undefined;

  return (
    <PatientProfile patient={patient} startAppointmentId={startAppointmentId} />
  );
}
