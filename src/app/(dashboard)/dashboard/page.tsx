import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { DashboardOverview } from "@/modules/dashboard/components/DashboardOverview";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const trendStart = new Date(todayStart);
  trendStart.setDate(trendStart.getDate() - 6);

  const [
    todayAppointments,
    monthEncounterCount,
    patientCount,
    trendAppointments,
  ] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        doctorId: session.user.id,
        date: { gte: todayStart, lt: tomorrowStart },
      },
      orderBy: { date: "asc" },
      select: {
        id: true,
        date: true,
        reason: true,
        status: true,
        encounter: { select: { id: true } },
        patient: {
          select: { id: true, name: true, hospitalNo: true },
        },
      },
    }),
    prisma.encounter.count({
      where: {
        doctorId: session.user.id,
        date: { gte: monthStart, lt: tomorrowStart },
      },
    }),
    prisma.patient.count(),
    prisma.appointment.findMany({
      where: {
        doctorId: session.user.id,
        date: { gte: trendStart, lt: tomorrowStart },
      },
      select: { date: true },
    }),
  ]);

  const appointmentCountsByDay = new Map<string, number>();
  for (let dayOffset = 0; dayOffset < 7; dayOffset += 1) {
    const date = new Date(trendStart);
    date.setDate(date.getDate() + dayOffset);
    appointmentCountsByDay.set(toDateKey(date), 0);
  }
  for (const appointment of trendAppointments) {
    const key = toDateKey(appointment.date);
    appointmentCountsByDay.set(key, (appointmentCountsByDay.get(key) ?? 0) + 1);
  }

  const trend = [...appointmentCountsByDay].map(([dateKey, count]) => {
    const [year, month, day] = dateKey.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return {
      day: new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(
        date,
      ),
      date: new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
      }).format(date),
      appointments: count,
    };
  });

  return (
    <DashboardOverview
      doctorName={session.user.name}
      today={now.toISOString()}
      appointments={todayAppointments.map((appointment) => ({
        id: appointment.id,
        date: appointment.date.toISOString(),
        reason: appointment.reason,
        status: appointment.status,
        encounterId: appointment.encounter?.id ?? null,
        patient: appointment.patient,
      }))}
      monthEncounterCount={monthEncounterCount}
      patientCount={patientCount}
      trend={trend}
    />
  );
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
