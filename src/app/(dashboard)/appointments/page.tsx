import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import AppointmentPage from "@/modules/appointments/pages/AppointmentPage";

export default async function AppointmentsRoute() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const [appointments, patients] = await Promise.all([
    prisma.appointment.findMany({
      where: { doctorId: session.user.id },
      orderBy: { date: "asc" },
      include: {
        patient: {
          select: { id: true, name: true, hospitalNo: true },
        },
      },
    }),
    prisma.patient.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, hospitalNo: true },
    }),
  ]);

  return (
    <AppointmentPage
      appointments={appointments.map((appointment) => ({
        id: appointment.id,
        date: appointment.date.toISOString(),
        reason: appointment.reason,
        status: appointment.status,
        patient: appointment.patient,
      }))}
      patients={patients}
    />
  );
}
