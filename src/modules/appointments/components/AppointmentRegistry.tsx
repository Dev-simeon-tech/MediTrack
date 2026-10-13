"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarClock,
  ClipboardPlus,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreateAppointmentDialog,
  type AppointmentPatientOption,
} from "@/modules/appointments/components/CreateAppointmentDialog";

export type AppointmentRecord = {
  id: string;
  date: string;
  reason: string | null;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  patient: AppointmentPatientOption;
};

const statuses = [
  "ALL",
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
] as const;

const statusLabels: Record<AppointmentRecord["status"], string> = {
  SCHEDULED: "Scheduled",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No-show",
};

export function AppointmentRegistry({
  appointments,
  patients,
}: {
  appointments: AppointmentRecord[];
  patients: AppointmentPatientOption[];
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statuses)[number]>("ALL");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesStatus = status === "ALL" || appointment.status === status;
    const matchesQuery = [
      appointment.patient.name,
      appointment.patient.hospitalNo,
      appointment.reason ?? "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);

    return matchesStatus && matchesQuery;
  });
  const scheduledCount = appointments.filter(
    (appointment) => appointment.status === "SCHEDULED",
  ).length;
  const todayCount = appointments.filter((appointment) =>
    isToday(new Date(appointment.date)),
  ).length;

  return (
    <main className='min-h-full bg-slate-50 px-4 py-5 text-slate-900 sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-7xl flex-col gap-5'>
        <header className='flex flex-col justify-between gap-4 sm:flex-row sm:items-end'>
          <div className='space-y-1'>
            <p className='text-xs font-medium text-muted-foreground'>
              Schedule <span className='px-1'>/</span> Appointments
            </p>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Appointments
            </h1>
            <p className='text-sm text-muted-foreground'>
              Review your schedule and manage patient visits.
            </p>
          </div>
          <CreateAppointmentDialog patients={patients} />
        </header>

        <section
          className='grid gap-3 sm:grid-cols-2'
          aria-label='Schedule summary'
        >
          <div className='flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4'>
            <span className='flex size-10 items-center justify-center rounded-md bg-blue-50 text-blue-700'>
              <CalendarClock className='size-5' aria-hidden='true' />
            </span>
            <div>
              <p className='text-xs text-muted-foreground'>Today</p>
              <p className='text-xl font-semibold tabular-nums'>{todayCount}</p>
            </div>
          </div>
          <div className='flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4'>
            <span className='flex size-10 items-center justify-center rounded-md bg-amber-50 text-amber-700'>
              <ClipboardPlus className='size-5' aria-hidden='true' />
            </span>
            <div>
              <p className='text-xs text-muted-foreground'>
                Awaiting encounter
              </p>
              <p className='text-xl font-semibold tabular-nums'>
                {scheduledCount}
              </p>
            </div>
          </div>
        </section>

        <section className='overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm'>
          <div className='flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <h2 className='font-semibold'>Appointment registry</h2>
              <p className='mt-0.5 text-xs text-muted-foreground'>
                {filteredAppointments.length} of {appointments.length}{" "}
                appointments
              </p>
            </div>
            <div className='flex flex-col gap-2 sm:flex-row'>
              <div className='relative min-w-0 sm:w-64'>
                <Search
                  className='pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground'
                  aria-hidden='true'
                />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder='Search patient or reason'
                  aria-label='Search appointments'
                  className='pl-8'
                />
              </div>
              <Select
                value={status}
                onValueChange={(value) =>
                  value && setStatus(value as (typeof statuses)[number])
                }
              >
                <SelectTrigger
                  className='w-full sm:w-40'
                  aria-label='Filter by status'
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item === "ALL" ? "All statuses" : statusLabels[item]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader className='bg-slate-50'>
              <TableRow>
                <TableHead>Date and time</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className='min-w-36'>
                    <p className='font-medium'>
                      {formatAppointmentDate(appointment.date)}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {formatAppointmentTime(appointment.date)}
                    </p>
                  </TableCell>
                  <TableCell className='min-w-48'>
                    <Link
                      href={`/patients/${appointment.patient.id}`}
                      className='font-medium text-slate-900 hover:text-primary hover:underline'
                    >
                      {appointment.patient.name}
                    </Link>
                    <p className='text-xs text-muted-foreground'>
                      MRN {appointment.patient.hospitalNo}
                    </p>
                  </TableCell>
                  <TableCell className='min-w-44 max-w-64 whitespace-normal text-sm text-slate-600'>
                    {appointment.reason || "Not specified"}
                  </TableCell>
                  <TableCell>
                    <AppointmentStatus status={appointment.status} />
                  </TableCell>
                  <TableCell className='text-right'>
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
                        <ClipboardPlus aria-hidden='true' />
                        Start Encounter
                      </Button>
                    ) : (
                      <Button
                        variant='outline'
                        size='sm'
                        nativeButton={false}
                        render={
                          <Link href={`/patients/${appointment.patient.id}`} />
                        }
                      >
                        View Patient
                        <ArrowUpRight aria-hidden='true' />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredAppointments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className='h-32 text-center'>
                    <p className='font-medium'>No appointments found</p>
                    <p className='mt-1 text-sm text-muted-foreground'>
                      Adjust the search or status filter, or book a new visit.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </section>
      </div>
    </main>
  );
}

function AppointmentStatus({
  status,
}: {
  status: AppointmentRecord["status"];
}) {
  const classes: Record<AppointmentRecord["status"], string> = {
    SCHEDULED: "border-blue-200 bg-blue-50 text-blue-800",
    COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-800",
    CANCELLED: "border-red-200 bg-red-50 text-red-800",
    NO_SHOW: "border-slate-200 bg-slate-100 text-slate-700",
  };

  return (
    <Badge variant='outline' className={classes[status]}>
      {statusLabels[status]}
    </Badge>
  );
}

function formatAppointmentDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatAppointmentTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function isToday(date: Date) {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}
