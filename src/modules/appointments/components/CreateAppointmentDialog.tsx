"use client";

import { useActionState, useEffect, useState } from "react";
import { CalendarPlus, UserRoundPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createAppointment,
  type CreateAppointmentState,
} from "@/modules/appointments/actions/createAppointment";

export type AppointmentPatientOption = {
  id: string;
  name: string;
  hospitalNo: string;
};

const initialState: CreateAppointmentState = {};

export function CreateAppointmentDialog({
  patients,
}: {
  patients: AppointmentPatientOption[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>
        <CalendarPlus aria-hidden='true' />
        Book Appointment
      </Button>
      <DialogContent className='max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Schedule appointment</DialogTitle>
          <DialogDescription>
            Add a patient visit to your schedule.
          </DialogDescription>
        </DialogHeader>
        {open && (
          <AppointmentForm
            patients={patients}
            onCancel={() => setOpen(false)}
            onSaved={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function AppointmentForm({
  patients,
  onCancel,
  onSaved,
}: {
  patients: AppointmentPatientOption[];
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [state, formAction, isPending] = useActionState(
    createAppointment,
    initialState,
  );
  const patientsItems = patients.map((patient) => ({
    label: patient.name,
    value: patient.id,
  }));
  const [patientId, setPatientId] = useState("");
  //   const [patientName,setPatientName] = useStateP
  const [dateTime, setDateTime] = useState(getInitialDateTime);

  useEffect(() => {
    if (!state.success) return;
    toast.success("Appointment scheduled.");
    onSaved();
  }, [onSaved, state.success]);

  const date = new Date(dateTime);
  const dateIso = Number.isNaN(date.getTime()) ? "" : date.toISOString();
  const fieldError = (name: string) => state.fieldErrors?.[name]?.[0];
  return (
    <form action={formAction} className='space-y-5'>
      <input type='hidden' name='patientId' value={patientId} />
      <input type='hidden' name='date' value={dateIso} />

      {state.error && (
        <p
          role='alert'
          className='rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800'
        >
          {state.error}
        </p>
      )}

      <Field className='gap-1.5'>
        <FieldLabel htmlFor='appointment-patient'>Patient</FieldLabel>
        <Select
          //   value={patient?.name}
          onValueChange={(value) => setPatientId(value as string)}
          items={patientsItems}
        >
          <SelectTrigger id='appointment-patient' className='w-full'>
            <SelectValue placeholder='Select a patient' />
          </SelectTrigger>
          <SelectContent>
            {patients.map((patient) => (
              <SelectItem key={patient.id} value={patient.id}>
                {patient.name} · {patient.hospitalNo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {fieldError("patientId") && (
          <FieldError>{fieldError("patientId")}</FieldError>
        )}
        {patients.length === 0 && (
          <p className='text-xs text-muted-foreground'>
            Add a patient record before scheduling an appointment.
          </p>
        )}
      </Field>

      <Field className='gap-1.5'>
        <FieldLabel htmlFor='appointment-date'>Date and time</FieldLabel>
        <Input
          id='appointment-date'
          type='datetime-local'
          value={dateTime}
          onChange={(event) => setDateTime(event.target.value)}
          aria-invalid={Boolean(fieldError("date"))}
        />
        {fieldError("date") && <FieldError>{fieldError("date")}</FieldError>}
      </Field>

      <Field className='gap-1.5'>
        <FieldLabel htmlFor='appointment-reason'>Reason for visit</FieldLabel>
        <Input
          id='appointment-reason'
          name='reason'
          placeholder='e.g. Follow-up consultation'
          maxLength={240}
          aria-invalid={Boolean(fieldError("reason"))}
        />
        {fieldError("reason") && (
          <FieldError>{fieldError("reason")}</FieldError>
        )}
      </Field>

      <div className='flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end'>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button type='submit' disabled={isPending || patients.length === 0}>
          <UserRoundPlus aria-hidden='true' />
          {isPending ? "Scheduling..." : "Schedule appointment"}
        </Button>
      </div>
    </form>
  );
}

function getInitialDateTime() {
  const date = new Date();
  date.setHours(date.getHours() + 1, 0, 0, 0);
  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000,
  );
  return localDate.toISOString().slice(0, 16);
}
