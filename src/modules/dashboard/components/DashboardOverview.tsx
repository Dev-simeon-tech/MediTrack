import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  ClipboardCheck,
  UsersRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AppointmentVolumeChart,
  type AppointmentTrendPoint,
} from "@/modules/dashboard/components/AppointmentVolumeChart";

type DashboardAppointment = {
  id: string;
  date: string;
  reason: string | null;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  encounterId: string | null;
  patient: { id: string; name: string; hospitalNo: string };
};

export function DashboardOverview({
  doctorName,
  today,
  appointments,
  monthEncounterCount,
  patientCount,
  trend,
}: {
  doctorName: string;
  today: string;
  appointments: DashboardAppointment[];
  monthEncounterCount: number;
  patientCount: number;
  trend: AppointmentTrendPoint[];
}) {
  const scheduledToday = appointments.filter(
    (appointment) => appointment.status === "SCHEDULED",
  ).length;
  const completedToday = appointments.filter(
    (appointment) => appointment.status === "COMPLETED",
  ).length;
  const dateLabel = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(today));
  const monthLabel = new Intl.DateTimeFormat(undefined, {
    month: "long",
  }).format(new Date(today));

  return (
    <main className='min-h-full bg-slate-50 px-4 py-5 text-slate-900 sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-7xl flex-col gap-5'>
        <header className='flex flex-col justify-between gap-4 sm:flex-row sm:items-end'>
          <div>
            <p className='text-xs font-medium text-muted-foreground'>
              {dateLabel}
            </p>
            <h1 className='mt-1 text-2xl font-semibold tracking-tight'>
              Good day, Dr. {doctorName}
            </h1>
            <p className='mt-1 text-sm text-muted-foreground'>
              Here is your clinical schedule and activity at a glance.
            </p>
          </div>
          <Button nativeButton={false} render={<Link href='/appointments' />}>
            <CalendarDays aria-hidden='true' />
            Manage appointments
          </Button>
        </header>

        <section
          className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'
          aria-label='Clinic analytics'
        >
          <MetricCard
            title="Today's appointments"
            value={appointments.length}
            detail={`${scheduledToday} still scheduled`}
            icon={<CalendarDays aria-hidden='true' />}
            tone='blue'
          />
          <MetricCard
            title='Completed today'
            value={completedToday}
            detail='Appointments with encounters'
            icon={<Check aria-hidden='true' />}
            tone='green'
          />
          <MetricCard
            title='Encounters this month'
            value={monthEncounterCount}
            detail={`Recorded in ${monthLabel}`}
            icon={<ClipboardCheck aria-hidden='true' />}
            tone='teal'
          />
          <MetricCard
            title='Patient records'
            value={patientCount}
            detail='Across the clinic'
            icon={<UsersRound aria-hidden='true' />}
            tone='amber'
          />
        </section>

        <section className='grid items-start gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)]'>
          <Card className='rounded-lg border-slate-200 shadow-sm'>
            <CardHeader className='flex-row items-start justify-between gap-3'>
              <div>
                <CardTitle className='text-base'>
                  Today&apos;s schedule
                </CardTitle>
                <CardDescription className='mt-1'>
                  {appointments.length}{" "}
                  {appointments.length === 1 ? "patient" : "patients"} booked
                  for today
                </CardDescription>
              </div>
              <Button
                variant='outline'
                size='sm'
                nativeButton={false}
                render={<Link href='/appointments' />}
              >
                Full schedule
                <ArrowRight aria-hidden='true' />
              </Button>
            </CardHeader>
            <CardContent className='px-0 pb-0'>
              {appointments.length > 0 ? (
                <Table>
                  <TableHeader className='bg-slate-50'>
                    <TableRow>
                      <TableHead className='pl-5'>Time</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead className='hidden md:table-cell'>
                        Reason
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className='pr-5 text-right'>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className='pl-5 font-medium tabular-nums'>
                          {formatTime(appointment.date)}
                        </TableCell>
                        <TableCell className='min-w-36'>
                          <Link
                            href={`/patients/${appointment.patient.id}`}
                            className='font-medium hover:text-primary hover:underline'
                          >
                            {appointment.patient.name}
                          </Link>
                          <p className='text-xs text-muted-foreground'>
                            MRN {appointment.patient.hospitalNo}
                          </p>
                        </TableCell>
                        <TableCell className='hidden max-w-48 truncate text-sm text-muted-foreground md:table-cell'>
                          {appointment.reason || "Not specified"}
                        </TableCell>
                        <TableCell>
                          <AppointmentStatus status={appointment.status} />
                        </TableCell>
                        <TableCell className='pr-5 text-right'>
                          {appointment.status === "SCHEDULED" ? (
                            <Button
                              size='sm'
                              nativeButton={false}
                              render={
                                <Link
                                  href={`/patients/${appointment.patient.id}?appointmentId=${appointment.id}`}
                                />
                              }
                            >
                              Start
                            </Button>
                          ) : (
                            <Button
                              size='sm'
                              variant='outline'
                              nativeButton={false}
                              render={
                                <Link
                                  href={`/patients/${appointment.patient.id}`}
                                />
                              }
                            >
                              View
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className='flex min-h-44 flex-col items-center justify-center border-t border-slate-100 px-5 text-center'>
                  <span className='mb-3 flex size-10 items-center justify-center rounded-md bg-blue-50 text-blue-700'>
                    <CalendarDays className='size-5' aria-hidden='true' />
                  </span>
                  <p className='font-medium'>No appointments scheduled today</p>
                  <p className='mt-1 max-w-sm text-sm text-muted-foreground'>
                    Your schedule is clear. Check upcoming visits or book a new
                    appointment.
                  </p>
                  <Button
                    className='mt-4'
                    variant='outline'
                    nativeButton={false}
                    render={<Link href='/appointments' />}
                  >
                    Open appointments
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className='rounded-lg border-slate-200 shadow-sm'>
            <CardHeader>
              <CardTitle className='text-base'>Appointment activity</CardTitle>
              <CardDescription>
                Scheduled visits over the last seven days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AppointmentVolumeChart data={trend} />
              <p className='mt-2 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-muted-foreground'>
                <Clock3 className='size-3.5' aria-hidden='true' />
                Includes all appointment statuses
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  title,
  value,
  detail,
  icon,
  tone,
}: {
  title: string;
  value: number;
  detail: string;
  icon: React.ReactNode;
  tone: "blue" | "green" | "teal" | "amber";
}) {
  const iconTone = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    teal: "bg-cyan-50 text-cyan-800",
    amber: "bg-amber-50 text-amber-800",
  }[tone];

  return (
    <Card className='rounded-lg border-slate-200 shadow-sm'>
      <CardContent className='flex items-start justify-between gap-3 p-4'>
        <div className='min-w-0'>
          <p className='text-sm text-muted-foreground'>{title}</p>
          <p className='mt-2 text-3xl font-semibold tabular-nums'>
            {value.toLocaleString()}
          </p>
          <p className='mt-1 text-xs text-muted-foreground'>{detail}</p>
        </div>
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-md ${iconTone}`}
        >
          {icon}
        </span>
      </CardContent>
    </Card>
  );
}

function AppointmentStatus({
  status,
}: {
  status: DashboardAppointment["status"];
}) {
  const styles: Record<DashboardAppointment["status"], string> = {
    SCHEDULED: "border-blue-200 bg-blue-50 text-blue-800",
    COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-800",
    CANCELLED: "border-red-200 bg-red-50 text-red-800",
    NO_SHOW: "border-slate-200 bg-slate-100 text-slate-700",
  };
  const labels: Record<DashboardAppointment["status"], string> = {
    SCHEDULED: "Scheduled",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    NO_SHOW: "No-show",
  };

  return (
    <Badge variant='outline' className={styles[status]}>
      {labels[status]}
    </Badge>
  );
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}
