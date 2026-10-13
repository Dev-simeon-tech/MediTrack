"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Copy,
  KeyRound,
  RefreshCw,
  ShieldCheck,
  UserRoundPlus,
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
import { Input } from "@/components/ui/input";
import {
  createDoctor,
  type CreateDoctorState,
} from "@/modules/admin/actions/createDoctor";

const initialState: CreateDoctorState = {};

function generateTemporaryPassword() {
  const alphabet =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*";
  const limit = Math.floor(256 / alphabet.length) * alphabet.length;
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let password = "";

  for (const byte of bytes) {
    if (byte >= limit) continue;
    password += alphabet[byte % alphabet.length];
    if (password.length === 20) break;
  }

  return password;
}

const inputClassName = "h-9 bg-white";
const selectClassName =
  "h-9 w-full rounded-lg border border-input bg-white px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function AddDoctorDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className='gap-2'>
            <UserRoundPlus aria-hidden='true' />
            Add Doctor
          </Button>
        }
      />
      <DialogContent className='max-h-[92vh] max-w-2xl overflow-y-auto p-0 sm:max-w-2xl'>
        <DialogHeader className='border-b bg-blue-50/60 px-5 py-4 pr-12 sm:px-6'>
          <div className='flex items-center gap-3'>
            <span className='flex size-10 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-white text-primary'>
              <UserRoundPlus aria-hidden='true' />
            </span>
            <div>
              <DialogTitle>Add New Doctor</DialogTitle>
              <DialogDescription className='mt-1'>
                Create a provider account and assign clinical details.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        {open && (
          <DoctorCreateForm
            onDone={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function DoctorCreateForm({
  onDone,
  onCancel,
}: {
  onDone: () => void;
  onCancel: () => void;
}) {
  const [state, formAction, isPending] = useActionState(
    createDoctor,
    initialState,
  );
  const [temporaryPassword, setTemporaryPassword] = useState(
    generateTemporaryPassword,
  );
  const router = useRouter();

  useEffect(() => {
    if (!state.success) return;
    router.refresh();
    toast.success(`${state.success.name} added to the doctor directory.`);
  }, [router, state.success]);

  async function copyPassword() {
    if (!temporaryPassword) return;

    try {
      await navigator.clipboard.writeText(temporaryPassword);
      toast.success("Temporary password copied.");
    } catch {
      toast.error("Could not copy the password. Select and copy it manually.");
    }
  }

  const fieldError = (name: string) => state.fieldErrors?.[name]?.[0];

  if (state.success) {
    return (
      <div className='space-y-5 px-5 py-5 sm:px-6'>
        <div className='flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900'>
          <ShieldCheck className='mt-0.5 size-5 shrink-0' aria-hidden='true' />
          <div>
            <p className='font-semibold'>Doctor account created</p>
            <p className='mt-1 text-sm'>
              {state.success.name} · {state.success.email}
            </p>
          </div>
        </div>
        <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
          <div className='mb-2 flex items-center gap-2 text-sm font-semibold text-blue-900'>
            <KeyRound className='size-4' aria-hidden='true' />
            Temporary portal password
          </div>
          <div className='flex flex-col gap-2 sm:flex-row'>
            <Input
              aria-label='Temporary portal password'
              className='h-9 bg-white font-mono text-sm'
              readOnly
              value={temporaryPassword}
            />
            <Button
              type='button'
              variant='outline'
              className='gap-2 bg-white'
              onClick={copyPassword}
            >
              <Copy aria-hidden='true' />
              Copy password
            </Button>
          </div>
          <p className='mt-2 text-xs leading-5 text-slate-600'>
            Share this password securely. The doctor must change it after their
            first sign-in.
          </p>
        </div>
        <DialogFooter className='-mx-5 -mb-5 sm:-mx-6 sm:-mb-5'>
          <Button type='button' onClick={onDone}>
            <Check aria-hidden='true' />
            Done
          </Button>
        </DialogFooter>
      </div>
    );
  }

  return (
    <form action={formAction} className='space-y-4 px-5 py-5 sm:px-6'>
      {state.error && (
        <p
          role='alert'
          className='rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800'
        >
          {state.error}
        </p>
      )}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <Field
          label='Full Name & Degree'
          name='name'
          required
          error={fieldError("name")}
        >
          <Input
            id='name'
            name='name'
            className={inputClassName}
            placeholder='Dr. Eleanor Vance, MD'
            autoComplete='name'
            required
            aria-invalid={Boolean(fieldError("name"))}
          />
        </Field>
        <Field
          label='Hospital Email Address'
          name='email'
          required
          error={fieldError("email")}
        >
          <Input
            id='email'
            name='email'
            type='email'
            className={inputClassName}
            placeholder='doctor@hospital.org'
            autoComplete='email'
            required
            aria-invalid={Boolean(fieldError("email"))}
          />
        </Field>
        <Field
          label='Direct Phone Number'
          name='phone'
          required
          error={fieldError("phone")}
        >
          <Input
            id='phone'
            name='phone'
            type='tel'
            className={inputClassName}
            placeholder='+1 (555) 890-1234'
            autoComplete='tel'
            required
            aria-invalid={Boolean(fieldError("phone"))}
          />
        </Field>
        <Field
          label='Specialization / Department'
          name='specialization'
          required
          error={fieldError("specialization")}
        >
          <select
            id='specialization'
            name='specialization'
            className={selectClassName}
            defaultValue=''
            required
            aria-invalid={Boolean(fieldError("specialization"))}
          >
            <option value='' disabled>
              Select a department
            </option>
            {[
              "Cardiology",
              "Internal Medicine",
              "Pediatrics",
              "Neurology",
              "Orthopedic Surgery",
              "General Surgery",
            ].map((specialization) => (
              <option key={specialization} value={specialization}>
                {specialization}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label='Medical License Number (NPI / State)'
          name='medicalLicenseNo'
          required
          error={fieldError("medicalLicenseNo")}
        >
          <Input
            id='medicalLicenseNo'
            name='medicalLicenseNo'
            className={`${inputClassName} font-mono`}
            placeholder='MD-LIC-2024-9912'
            required
            aria-invalid={Boolean(fieldError("medicalLicenseNo"))}
          />
        </Field>
        <Field
          label='Date of Birth'
          name='dateOfBirth'
          error={fieldError("dateOfBirth")}
        >
          <Input
            id='dateOfBirth'
            name='dateOfBirth'
            type='date'
            className={inputClassName}
            aria-invalid={Boolean(fieldError("dateOfBirth"))}
          />
        </Field>
        <Field label='Gender' name='gender' error={fieldError("gender")}>
          <select
            id='gender'
            name='gender'
            className={selectClassName}
            defaultValue=''
            aria-invalid={Boolean(fieldError("gender"))}
          >
            <option value=''>Select gender (optional)</option>
            <option value='FEMALE'>Female</option>
            <option value='MALE'>Male</option>
            <option value='NON_BINARY'>Non-binary</option>
            <option value='PREFER_NOT_TO_SAY'>Prefer not to state</option>
          </select>
        </Field>
        <Field
          label='Assigned Unit'
          name='assignedUnit'
          error={fieldError("assignedUnit")}
        >
          <Input
            id='assignedUnit'
            name='assignedUnit'
            className={inputClassName}
            placeholder='Wing B - Cardiac Telemetry'
          />
        </Field>
      </div>

      <section className='rounded-lg border border-blue-200 bg-blue-50/70 p-4'>
        <div className='mb-2 flex items-center justify-between gap-3'>
          <div className='flex items-center gap-2 text-sm font-semibold text-blue-900'>
            <KeyRound className='size-4' aria-hidden='true' />
            Provider Portal Access
          </div>
          <span className='rounded-full border border-blue-200 bg-white px-2 py-0.5 text-[11px] font-medium text-blue-800'>
            Secure Auth
          </span>
        </div>
        <label
          htmlFor='temporaryPassword'
          className='mb-1 block text-xs font-medium text-slate-700'
        >
          Temporary password
        </label>
        <div className='flex flex-col gap-2 sm:flex-row'>
          <Input
            id='temporaryPassword'
            name='temporaryPassword'
            className='h-9 bg-white font-mono text-sm'
            value={temporaryPassword}
            onChange={(event) => setTemporaryPassword(event.target.value)}
            autoComplete='new-password'
            required
            aria-invalid={Boolean(fieldError("temporaryPassword"))}
          />
          <Button
            type='button'
            variant='outline'
            className='shrink-0 gap-2 bg-white'
            onClick={() => setTemporaryPassword(generateTemporaryPassword())}
          >
            <RefreshCw aria-hidden='true' />
            Regenerate
          </Button>
          <Button
            type='button'
            variant='outline'
            className='shrink-0 gap-2 bg-white'
            onClick={copyPassword}
            disabled={!temporaryPassword}
            aria-label='Copy temporary password'
          >
            <Copy aria-hidden='true' />
            Copy
          </Button>
        </div>
        {fieldError("temporaryPassword") && (
          <p className='mt-1 text-xs text-destructive' role='alert'>
            {fieldError("temporaryPassword")}
          </p>
        )}
        <p className='mt-2 text-xs leading-5 text-slate-600'>
          The doctor must change this password after their first sign-in. Share
          the generated credential securely.
        </p>
      </section>

      <DialogFooter className='-mx-5 -mb-5 sm:-mx-6 sm:-mb-5'>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button type='submit' disabled={isPending} className='gap-2'>
          <UserRoundPlus aria-hidden='true' />
          {isPending ? "Creating Account…" : "Create Doctor Account"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function Field({
  label,
  name,
  required = false,
  error,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className='min-w-0 space-y-1'>
      <label
        htmlFor={name}
        className='block text-xs font-semibold text-slate-800'
      >
        {label}
        {required && (
          <span className='ml-1 text-red-600' aria-hidden='true'>
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p className='text-xs text-destructive' role='alert'>
          {error}
        </p>
      )}
    </div>
  );
}
