"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagInput } from "@/modules/patients/components/TagInput";
import {
  createEncounter,
  type CreateEncounterState,
} from "@/modules/patients/actions/createEncounter";

type AppointmentOption = {
  id: string;
  date: string;
  reason: string | null;
};

type PrescriptionDraft = {
  drug: string;
  dosage: string;
  duration: string;
};

const categories = [
  { value: "CONSULTATION", label: "Consultation" },
  { value: "FOLLOW_UP", label: "Follow-up" },
  { value: "URGENT_TRIAGE", label: "Urgent / Triage" },
  { value: "PROCEDURE", label: "Procedure" },
] as const;

const initialState: CreateEncounterState = {};

export function EncounterForm({
  patientId,
  patientName,
  hospitalNo,
  patientSummary,
  appointments,
  initialAppointmentId,
}: {
  patientId: string;
  patientName: string;
  hospitalNo: string;
  patientSummary: string;
  appointments: AppointmentOption[];
  initialAppointmentId?: string;
}) {
  const [open, setOpen] = useState(Boolean(initialAppointmentId));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size='lg'>
            <ClipboardList aria-hidden='true' />
            Add Clinical Encounter
          </Button>
        }
      />
      <DialogContent className='flex max-h-[calc(100dvh-2rem)] max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl'>
        <DialogHeader className='shrink-0 border-b border-slate-200 bg-white px-5 py-4 pr-12 sm:px-6'>
          <div className='flex flex-wrap items-start justify-between gap-3'>
            <div>
              <DialogTitle className='text-base font-semibold text-slate-950'>
                New Encounter
              </DialogTitle>
              <DialogDescription className='mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs'>
                <span className='rounded-full bg-blue-50 px-2 py-0.5 font-semibold text-blue-800'>
                  {patientName}
                </span>
                <span aria-hidden='true'>·</span>
                <span>MRN: {hospitalNo}</span>
                <span aria-hidden='true'>·</span>
                <span>{patientSummary}</span>
              </DialogDescription>
            </div>
            {appointments.length > 0 && (
              <span className='inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800'>
                <CalendarDays className='size-3.5' aria-hidden='true' />
                {appointments.length} scheduled{" "}
                {appointments.length === 1 ? "appointment" : "appointments"}
              </span>
            )}
          </div>
        </DialogHeader>
        {open && (
          <EncounterCreateForm
            patientId={patientId}
            appointments={appointments}
            initialAppointmentId={initialAppointmentId}
            onCancel={() => setOpen(false)}
            onSaved={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EncounterCreateForm({
  patientId,
  appointments,
  initialAppointmentId,
  onCancel,
  onSaved,
}: {
  patientId: string;
  appointments: AppointmentOption[];
  initialAppointmentId?: string;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [state, formAction, isPending] = useActionState(
    createEncounter,
    initialState,
  );
  const [category, setCategory] = useState("CONSULTATION");
  const [appointmentId, setAppointmentId] = useState(
    initialAppointmentId ?? "",
  );
  const [prescriptions, setPrescriptions] = useState<PrescriptionDraft[]>([]);
  const [draft, setDraft] = useState<PrescriptionDraft>({
    drug: "",
    dosage: "",
    duration: "",
  });
  const [prescriptionError, setPrescriptionError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!state.success) return;
    toast.success("Encounter saved to the patient record.");
    router.refresh();
    onSaved();
  }, [onSaved, router, state.success]);

  const fieldError = (name: string) => state.fieldErrors?.[name]?.[0];

  function addPrescription() {
    const medication = {
      drug: draft.drug.trim(),
      dosage: draft.dosage.trim(),
      duration: draft.duration.trim(),
    };

    if (!medication.drug || !medication.dosage || !medication.duration) {
      setPrescriptionError("Complete medication, dosage, and duration first.");
      return;
    }

    setPrescriptions((current) => [...current, medication]);
    setDraft({ drug: "", dosage: "", duration: "" });
    setPrescriptionError("");
  }

  return (
    <form action={formAction} className='flex min-h-0 flex-1 flex-col'>
      <input type='hidden' name='patientId' value={patientId} />
      <input type='hidden' name='category' value={category} />
      <input type='hidden' name='appointmentId' value={appointmentId} />
      <input
        type='hidden'
        name='prescriptions'
        value={JSON.stringify(prescriptions)}
      />

      <div className='min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6'>
        {state.error && (
          <p
            role='alert'
            className='rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800'
          >
            {state.error}
          </p>
        )}

        <section className='space-y-4' aria-labelledby='visit-details-heading'>
          <div className='flex items-start justify-between gap-3'>
            <div className='flex items-start gap-2.5'>
              <ClipboardList
                className='mt-0.5 size-5 text-primary'
                aria-hidden='true'
              />
              <div>
                <h3
                  id='visit-details-heading'
                  className='text-sm font-semibold text-slate-900'
                >
                  Visit Details
                </h3>
                <p className='text-xs text-slate-500'>
                  Primary clinical observations and assessment
                </p>
              </div>
            </div>
            <span className='rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-800'>
              Required
            </span>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <Field className='gap-1.5'>
              <FieldLabel htmlFor='category'>Encounter Category</FieldLabel>
              <Select
                value={category}
                onValueChange={(value) => value && setCategory(value)}
              >
                <SelectTrigger id='category' className='h-9 w-full bg-white'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldError("category") && (
                <FieldError>{fieldError("category")}</FieldError>
              )}
            </Field>

            <Field className='gap-1.5'>
              <FieldLabel htmlFor='appointment'>Link Appointment</FieldLabel>
              <Select
                value={appointmentId || "none"}
                onValueChange={(value) =>
                  setAppointmentId(!value || value === "none" ? "" : value)
                }
              >
                <SelectTrigger id='appointment' className='h-9 w-full bg-white'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='none'>No appointment</SelectItem>
                  {appointments.map((appointment) => (
                    <SelectItem key={appointment.id} value={appointment.id}>
                      {new Date(appointment.date).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                      {appointment.reason ? ` · ${appointment.reason}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldError("appointmentId") && (
                <FieldError>{fieldError("appointmentId")}</FieldError>
              )}
            </Field>

            <Field className='gap-1.5 sm:col-span-2'>
              <div className='flex items-center justify-between gap-2'>
                <FieldLabel htmlFor='complaint'>Chief Complaint</FieldLabel>
                <FieldDescription className='text-xs'>
                  Patient&apos;s words
                </FieldDescription>
              </div>
              <Input
                id='complaint'
                name='complaint'
                required
                minLength={2}
                placeholder='Describe the reason for today’s visit'
                aria-invalid={Boolean(fieldError("complaint"))}
                className='h-9 bg-white'
              />
              {fieldError("complaint") && (
                <FieldError>{fieldError("complaint")}</FieldError>
              )}
            </Field>

            <Field className='gap-1.5 sm:col-span-2'>
              <TagInput
                name='diagnosis'
                label='Clinical Diagnosis (ICD-10)'
                placeholder='Add a diagnosis and press Enter'
              />
              {fieldError("diagnosis") && (
                <FieldError>{fieldError("diagnosis")}</FieldError>
              )}
            </Field>

            <Field className='gap-1.5 sm:col-span-2'>
              <FieldLabel htmlFor='notes'>
                Clinical Notes & Assessment
              </FieldLabel>
              <Textarea
                id='notes'
                name='notes'
                rows={4}
                placeholder='Document relevant history, examination findings, and assessment...'
                className='min-h-24 resize-y bg-white leading-6'
              />
              {fieldError("notes") && (
                <FieldError>{fieldError("notes")}</FieldError>
              )}
            </Field>
          </div>
        </section>

        <section className='overflow-hidden rounded-lg border border-slate-200'>
          <div className='flex items-center gap-2 border-b border-slate-200 bg-blue-50/70 px-4 py-3'>
            <Activity className='size-4 text-primary' aria-hidden='true' />
            <div>
              <h3 className='text-sm font-semibold text-slate-900'>Vitals</h3>
              <p className='text-xs text-slate-500'>
                Optional / triage recorded
              </p>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-3 bg-white p-4 sm:grid-cols-4'>
            <VitalInput
              name='bp'
              label='Blood Pressure'
              unit='mmHg'
              placeholder='120/80'
            />
            <VitalInput
              name='temp'
              label='Temperature'
              unit='°C'
              placeholder='36.8'
              type='number'
              step='0.1'
            />
            <VitalInput
              name='weight'
              label='Weight'
              unit='kg'
              placeholder='68'
              type='number'
              step='0.1'
            />
            <VitalInput
              name='height'
              label='Height'
              unit='cm'
              placeholder='172'
              type='number'
              step='0.1'
            />
          </div>
        </section>

        <section className='space-y-3' aria-labelledby='prescriptions-heading'>
          <div className='flex items-center gap-2'>
            <Plus className='size-4 text-primary' aria-hidden='true' />
            <h3
              id='prescriptions-heading'
              className='text-sm font-semibold text-slate-900'
            >
              Prescriptions
            </h3>
            <span className='text-xs text-slate-500'>
              {prescriptions.length}{" "}
              {prescriptions.length === 1 ? "item" : "items"}
            </span>
          </div>

          {prescriptions.length > 0 && (
            <ul className='space-y-2'>
              {prescriptions.map((prescription, index) => (
                <li
                  key={`${prescription.drug}-${index}`}
                  className='flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3'
                >
                  <div className='min-w-0'>
                    <p className='truncate text-sm font-semibold text-slate-900'>
                      {prescription.drug}
                    </p>
                    <p className='mt-1 text-xs text-slate-600'>
                      {prescription.dosage} · {prescription.duration}
                    </p>
                  </div>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon-sm'
                    aria-label={`Remove ${prescription.drug}`}
                    onClick={() =>
                      setPrescriptions((current) =>
                        current.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                  >
                    <Trash2 aria-hidden='true' />
                  </Button>
                </li>
              ))}
            </ul>
          )}

          <div className='grid items-end gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50/70 p-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_auto]'>
            <Field className='gap-1.5'>
              <FieldLabel htmlFor='prescription-drug'>Medication</FieldLabel>
              <Input
                id='prescription-drug'
                value={draft.drug}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    drug: event.target.value,
                  }))
                }
                placeholder='Medication name'
                className='h-9 bg-white'
              />
            </Field>
            <Field className='gap-1.5'>
              <FieldLabel htmlFor='prescription-dosage'>Dosage</FieldLabel>
              <Input
                id='prescription-dosage'
                value={draft.dosage}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    dosage: event.target.value,
                  }))
                }
                placeholder='e.g. 400 mg'
                className='h-9 bg-white'
              />
            </Field>
            <Field className='gap-1.5'>
              <FieldLabel htmlFor='prescription-duration'>
                Instructions
              </FieldLabel>
              <Input
                id='prescription-duration'
                value={draft.duration}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    duration: event.target.value,
                  }))
                }
                placeholder='Frequency / duration'
                className='h-9 bg-white'
              />
            </Field>
            <Button
              type='button'
              variant='outline'
              className='h-9 gap-1.5 bg-white'
              onClick={addPrescription}
            >
              <Plus aria-hidden='true' />
              Add
            </Button>
          </div>
          {prescriptionError && (
            <p role='alert' className='text-xs text-destructive'>
              {prescriptionError}
            </p>
          )}
          {fieldError("prescriptions") && (
            <FieldError>{fieldError("prescriptions")}</FieldError>
          )}
        </section>
      </div>

      <DialogFooter className='shrink-0 flex-row items-center justify-between border-t border-slate-200 bg-white px-5 py-3 sm:px-6'>
        <span className='hidden items-center gap-1.5 text-xs text-slate-500 sm:flex'>
          <CheckCircle2
            className='size-3.5 text-emerald-600'
            aria-hidden='true'
          />
          Saved to the patient record
        </span>
        <div className='flex w-full justify-end gap-2 sm:w-auto'>
          <Button type='button' variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button type='submit' disabled={isPending} className='min-w-36 gap-2'>
            <Save aria-hidden='true' />
            {isPending ? "Saving…" : "Save Encounter"}
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}

function VitalInput({
  name,
  label,
  unit,
  type = "text",
  step,
  placeholder,
}: {
  name: string;
  label: string;
  unit: string;
  type?: "text" | "number";
  step?: string;
  placeholder: string;
}) {
  return (
    <Field className='gap-1.5'>
      <FieldLabel htmlFor={name} className='text-xs'>
        {label}
      </FieldLabel>
      <div className='relative'>
        <Input
          id={name}
          name={name}
          type={type}
          step={step}
          min={type === "number" ? "0" : undefined}
          placeholder={placeholder}
          className='h-9 bg-white pr-10 tabular-nums'
        />
        <span className='pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500'>
          {unit}
        </span>
      </div>
    </Field>
  );
}
