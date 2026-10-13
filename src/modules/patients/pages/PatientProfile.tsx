"use client";

import { useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  FileText,
  HeartPulse,
  Pill,
  Search,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SummaryMetric } from "../components/SummaryMetric";
import { EncounterForm } from "../components/EncounterForm";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getAge,
  getInitials,
  getNestedRecords,
  getRelatedName,
  getString,
  formatDate,
} from "../utils";
import type { Patient } from "@/types/patient";

type RecordData = Record<string, unknown>;

function EmptyState({ message }: { message: string }) {
  return (
    <div className='flex min-h-36 flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-white px-6 text-center'>
      <ClipboardList
        className='size-5 text-muted-foreground'
        aria-hidden='true'
      />
      <p className='text-sm text-muted-foreground'>{message}</p>
    </div>
  );
}

const PatientProfile = ({
  patient,
  startAppointmentId,
}: {
  patient: Patient;
  startAppointmentId?: string;
}) => {
  const [historyFilter, setHistoryFilter] = useState("");
  const age = getAge(patient.dob);
  const latestVital = patient.vitals[0];
  const encounters = patient.encounters;
  const filteredEncounters = encounters.filter((encounter) =>
    [
      getString(encounter, "complaint", ""),
      getString(encounter, "diagnosis", ""),
      getString(encounter, "notes", ""),
    ]
      .join(" ")
      .toLowerCase()
      .includes(historyFilter.toLowerCase()),
  );
  const prescriptions = encounters.flatMap((encounter) =>
    getNestedRecords(encounter, "prescriptions").map((prescription) => ({
      ...prescription,
      prescribedOn: encounter.date,
      prescribedBy: getRelatedName(encounter, "doctor"),
    })),
  );
  const availableAppointments = patient.appointments
    .filter(
      (appointment) => getString(appointment, "status", "") === "SCHEDULED",
    )
    .map((appointment) => ({
      id: getString(appointment, "id", ""),
      date:
        appointment.date instanceof Date
          ? appointment.date.toISOString()
          : getString(appointment, "date", ""),
      reason:
        typeof appointment.reason === "string" ? appointment.reason : null,
    }))
    .filter((appointment) => appointment.id && appointment.date);

  return (
    <main className='min-h-full bg-slate-50 px-4 py-5 text-slate-900 sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-360 flex-col gap-5'>
        <header className='flex flex-col justify-between gap-4 xl:flex-row xl:items-end'>
          <div className='space-y-1'>
            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
              <span>Patients</span>
              <span aria-hidden='true'>/</span>
              <span className='font-medium text-primary'>{patient.name}</span>
            </div>
            <h1 className='text-2xl font-semibold tracking-tight sm:text-[28px]'>
              Patient Profile
              <span className='font-normal text-slate-500'>
                : {patient.name}
              </span>
            </h1>
            <p className='text-sm text-muted-foreground'>
              Medical record {patient.hospitalNo}
            </p>
          </div>
          <div className='flex flex-wrap gap-2'>
            <Button
              variant='outline'
              size='lg'
              title='Patient editing is not available yet'
            >
              Edit Patient
            </Button>
            <EncounterForm
              patientId={patient.id}
              patientName={patient.name}
              hospitalNo={patient.hospitalNo}
              patientSummary={`${patient.sex === "FEMALE" ? "Female" : "Male"}, ${age === null ? "age not recorded" : `${age}y`}`}
              appointments={availableAppointments}
              initialAppointmentId={startAppointmentId}
            />
          </div>
        </header>

        <div className='grid items-start gap-5 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]'>
          <Card className='rounded-lg border-slate-200 shadow-sm'>
            <CardContent className='space-y-5 p-4'>
              <div className='flex flex-col items-center border-b border-slate-100 pb-4 text-center'>
                <Avatar
                  className='mb-3 size-16 border-2 border-primary/80'
                  aria-label={patient.name}
                >
                  <AvatarFallback className='bg-blue-50 text-lg font-semibold text-primary'>
                    {getInitials(patient.name)}
                  </AvatarFallback>
                </Avatar>
                <h2 className='font-semibold'>{patient.name}</h2>
                <p className='text-xs text-muted-foreground'>
                  MRN {patient.hospitalNo}
                </p>
                <Badge
                  variant='outline'
                  className='mt-2 border-emerald-200 bg-emerald-50 text-emerald-800'
                >
                  Active patient
                </Badge>
              </div>

              <dl className='space-y-3 text-sm'>
                <div className='flex justify-between gap-3 border-b border-slate-100 pb-2'>
                  <dt className='text-muted-foreground'>Age / Gender</dt>
                  <dd className='text-right font-medium'>
                    {age === null ? "Not recorded" : age} /{" "}
                    {patient.sex === "FEMALE" ? "Female" : "Male"}
                  </dd>
                </div>
                <div className='flex justify-between gap-3 border-b border-slate-100 pb-2'>
                  <dt className='text-muted-foreground'>Blood group</dt>
                  <dd className='text-right font-medium'>
                    {patient.bloodGroup ?? "Not recorded"}
                  </dd>
                </div>
                <div className='flex justify-between gap-3 border-b border-slate-100 pb-2'>
                  <dt className='text-muted-foreground'>Primary contact</dt>
                  <dd className='text-right font-medium'>
                    {patient.phone ?? "Not recorded"}
                  </dd>
                </div>
                <div className='flex justify-between gap-3 border-b border-slate-100 pb-2'>
                  <dt className='text-muted-foreground'>Address</dt>
                  <dd className='max-w-32 text-right font-medium'>
                    {patient.address ?? "Not recorded"}
                  </dd>
                </div>
              </dl>

              <section
                className='rounded-lg bg-blue-50/80 p-3'
                aria-labelledby='latest-vitals-heading'
              >
                <h3
                  id='latest-vitals-heading'
                  className='mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600'
                >
                  Latest vitals
                </h3>
                {latestVital ? (
                  <div className='grid grid-cols-2 gap-2'>
                    <Vital
                      value={getString(latestVital, "bp")}
                      label='Blood pressure'
                    />
                    <Vital
                      value={
                        typeof latestVital.temp === "number"
                          ? `${latestVital.temp} °C`
                          : "Not recorded"
                      }
                      label='Temperature'
                    />
                    <Vital
                      value={
                        typeof latestVital.weight === "number"
                          ? `${latestVital.weight} kg`
                          : "Not recorded"
                      }
                      label='Weight'
                    />
                    <Vital
                      value={
                        typeof latestVital.height === "number"
                          ? `${latestVital.height} cm`
                          : "Not recorded"
                      }
                      label='Height'
                    />
                  </div>
                ) : (
                  <p className='text-xs text-muted-foreground'>
                    No vitals have been recorded.
                  </p>
                )}
              </section>

              <section className='space-y-2'>
                <h3 className='text-sm font-semibold'>Emergency contact</h3>
                <p className='text-sm text-muted-foreground'>
                  {patient.emergencyName ?? "Not recorded"}
                </p>
                <p className='text-sm text-muted-foreground'>
                  {patient.emergencyPhone ?? "No phone recorded"}
                </p>
              </section>
            </CardContent>
          </Card>

          <Tabs defaultValue='overview' className='min-w-0  gap-4'>
            <div className='rounded-lg border border-slate-200 bg-white px-2 shadow-sm'>
              <TabsList
                variant='line'
                className='h-full w-max min-w-full justify-start gap-1 rounded-none'
              >
                <TabsTrigger value='overview' className='min-w-24 px-3'>
                  Overview
                </TabsTrigger>
                <TabsTrigger value='history' className='min-w-32 px-3'>
                  Medical History
                </TabsTrigger>
                <TabsTrigger value='prescriptions' className='min-w-28 px-3'>
                  Prescriptions
                </TabsTrigger>
                <TabsTrigger value='labs' className='min-w-24 px-3'>
                  Lab Results
                </TabsTrigger>
                <TabsTrigger value='appointments' className='min-w-28 px-3'>
                  Appointments
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value='overview' className='space-y-4'>
              <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
                <SummaryMetric
                  icon={<HeartPulse />}
                  label='Encounters'
                  value={String(encounters.length)}
                />
                <SummaryMetric
                  icon={<Pill />}
                  label='Prescriptions'
                  value={String(prescriptions.length)}
                />
                <SummaryMetric
                  icon={<CalendarDays />}
                  label='Appointments'
                  value={String(patient.appointments.length)}
                />
                <SummaryMetric
                  icon={<FileText />}
                  label='Documents'
                  value={String(patient.documents.length)}
                />
              </div>
              <Card className='rounded-lg border-slate-200 shadow-sm'>
                <CardHeader className='border-b border-slate-100 py-3'>
                  <CardTitle className='text-base'>
                    Chronic conditions
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex flex-wrap gap-2 py-4'>
                  {patient.chronicConditions.length ? (
                    patient.chronicConditions.map((condition) => (
                      <Badge key={condition} variant='secondary'>
                        {condition}
                      </Badge>
                    ))
                  ) : (
                    <p className='text-sm text-muted-foreground'>
                      No chronic conditions recorded.
                    </p>
                  )}
                </CardContent>
              </Card>
              <Card className='rounded-lg border-slate-200 shadow-sm'>
                <CardHeader className='border-b border-slate-100 py-3'>
                  <CardTitle className='text-base'>Recent encounters</CardTitle>
                </CardHeader>
                <CardContent className='space-y-3 py-4'>
                  {encounters.slice(0, 3).length ? (
                    encounters
                      .slice(0, 3)
                      .map((encounter) => (
                        <EncounterSummary
                          key={getString(encounter, "id", `${encounter.date}`)}
                          encounter={encounter}
                        />
                      ))
                  ) : (
                    <p className='text-sm text-muted-foreground'>
                      No encounters recorded.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='history' className='space-y-4'>
              <div className='relative'>
                <Search
                  className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground'
                  aria-hidden='true'
                />
                <Input
                  value={historyFilter}
                  onChange={(event) => setHistoryFilter(event.target.value)}
                  placeholder='Filter encounters by diagnosis or notes'
                  aria-label='Filter medical history'
                  className='h-10 bg-white pl-9'
                />
              </div>
              <div className='relative space-y-3 pl-4 before:absolute before:bottom-5 before:left-1.75 before:top-5 before:w-px before:bg-slate-200'>
                {filteredEncounters.length ? (
                  filteredEncounters.map((encounter) => (
                    <EncounterSummary
                      key={getString(encounter, "id", `${encounter.date}`)}
                      encounter={encounter}
                      timeline
                    />
                  ))
                ) : (
                  <EmptyState
                    message={
                      historyFilter
                        ? "No encounters match that filter."
                        : "No medical history has been recorded."
                    }
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent value='prescriptions'>
              <Card className='rounded-lg border-slate-200 shadow-sm'>
                <CardHeader className='border-b border-slate-100 py-3'>
                  <CardTitle className='text-base'>Prescriptions</CardTitle>
                </CardHeader>
                {prescriptions.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow className='bg-slate-50 hover:bg-slate-50'>
                        <TableHead>Medication</TableHead>
                        <TableHead>Dosage</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Prescribed by</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prescriptions.map((prescription, index) => (
                        <TableRow
                          key={`${getString(prescription, "id", String(index))}-${getString(prescription, "drug")}`}
                        >
                          <TableCell className='font-medium'>
                            {getString(prescription, "drug")}
                          </TableCell>
                          <TableCell>
                            {getString(prescription, "dosage")}
                          </TableCell>
                          <TableCell>
                            {getString(prescription, "duration")}
                          </TableCell>
                          <TableCell>{prescription.prescribedBy}</TableCell>
                          <TableCell>
                            {formatDate(prescription.prescribedOn)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <CardContent className='py-4'>
                    <EmptyState message='No prescriptions have been recorded.' />
                  </CardContent>
                )}
              </Card>
            </TabsContent>

            <TabsContent value='labs' className='space-y-4'>
              <Card className='rounded-lg border-slate-200 shadow-sm'>
                <CardHeader className='border-b border-slate-100 py-3'>
                  <CardTitle className='text-base'>Lab results</CardTitle>
                </CardHeader>
                <CardContent className='py-4'>
                  <EmptyState message='Structured lab results are not available in this patient record.' />
                </CardContent>
              </Card>
              <Card className='rounded-lg border-slate-200 shadow-sm'>
                <CardHeader className='border-b border-slate-100 py-3'>
                  <CardTitle className='text-base'>Patient documents</CardTitle>
                </CardHeader>
                <CardContent className='divide-y divide-slate-100 py-1'>
                  {patient.documents.length ? (
                    patient.documents.map((document) => (
                      <div
                        key={getString(
                          document,
                          "id",
                          getString(document, "label"),
                        )}
                        className='flex items-center justify-between gap-3 py-3'
                      >
                        <div className='flex min-w-0 items-center gap-3'>
                          <FileText
                            className='size-4 shrink-0 text-slate-500'
                            aria-hidden='true'
                          />
                          <span className='truncate text-sm font-medium'>
                            {getString(document, "label")}
                          </span>
                        </div>
                        <span className='shrink-0 text-xs text-muted-foreground'>
                          {formatDate(document.uploadedAt)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className='py-4 text-sm text-muted-foreground'>
                      No documents have been uploaded.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='appointments' className='space-y-3'>
              {patient.appointments.length ? (
                patient.appointments.map((appointment) => (
                  <Card
                    key={getString(appointment, "id", `${appointment.date}`)}
                    className='rounded-lg border-slate-200 shadow-sm'
                  >
                    <CardContent className='flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center'>
                      <div className='flex items-start gap-3'>
                        <div className='rounded-md bg-blue-50 p-2 text-primary'>
                          <CalendarDays className='size-5' aria-hidden='true' />
                        </div>
                        <div>
                          <h3 className='font-medium'>
                            {getString(appointment, "reason", "Appointment")}
                          </h3>
                          <p className='mt-1 text-sm text-muted-foreground'>
                            {formatDate(appointment.date)} ·{" "}
                            {getRelatedName(appointment, "doctor")}
                          </p>
                        </div>
                      </div>
                      <AppointmentStatus
                        status={getString(appointment, "status", "SCHEDULED")}
                      />
                    </CardContent>
                  </Card>
                ))
              ) : (
                <EmptyState message='No appointments have been scheduled.' />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
};

function Vital({ value, label }: { value: string; label: string }) {
  return (
    <div className='min-w-0 rounded-md border border-slate-100 bg-white p-2'>
      <p className='truncate text-[11px] text-muted-foreground'>{label}</p>
      <p className='mt-1 truncate text-sm font-semibold tabular-nums text-primary'>
        {value}
      </p>
    </div>
  );
}

function EncounterSummary({
  encounter,
  timeline = false,
}: {
  encounter: RecordData;
  timeline?: boolean;
}) {
  const diagnosis = getString(encounter, "diagnosis", "");
  const complaint = getString(encounter, "complaint");
  return (
    <article
      className={`relative rounded-lg border border-slate-200 bg-white p-4 shadow-sm ${timeline ? "ml-2" : ""}`}
    >
      {timeline && (
        <span
          className='absolute -left-4.75 top-5 size-3 rounded-full border-2 border-white bg-primary ring-1 ring-slate-200'
          aria-hidden='true'
        />
      )}
      <div className='flex flex-col justify-between gap-2 sm:flex-row sm:items-start'>
        <div className='flex flex-wrap items-center gap-2'>
          <Badge variant='outline'>Encounter</Badge>
          <span className='text-xs text-muted-foreground'>
            {formatDate(encounter.date)}
          </span>
        </div>
        <span className='text-xs text-muted-foreground'>
          {getRelatedName(encounter, "doctor")}
        </span>
      </div>
      <h3 className='mt-3 font-semibold'>{diagnosis || complaint}</h3>
      {diagnosis && diagnosis !== complaint && (
        <p className='mt-1 text-sm text-muted-foreground'>{complaint}</p>
      )}
      {getString(encounter, "notes", "") && (
        <p className='mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600'>
          {getString(encounter, "notes", "")}
        </p>
      )}
    </article>
  );
}

function AppointmentStatus({ status }: { status: string }) {
  const variant =
    status === "SCHEDULED"
      ? "secondary"
      : status === "CANCELLED" || status === "NO_SHOW"
        ? "destructive"
        : "outline";
  const label = status.replaceAll("_", " ").toLowerCase();
  return (
    <Badge variant={variant} className='capitalize'>
      {label}
    </Badge>
  );
}

export default PatientProfile;
