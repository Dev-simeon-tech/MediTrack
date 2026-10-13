import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { DataTableColumn } from "@/components/data-table";
import { getAge, getInitials, formatDateOnly } from "@/modules/patients/utils";
import { PatientClinicalFlag } from "@/modules/patients/components/PatientClinicalFlag";
import type { PatientDirectoryRecord } from "@/types/patient-directory";

export const patientDirectoryColumns: DataTableColumn<PatientDirectoryRecord>[] =
  [
    {
      id: "hospitalNo",
      header: "Hospital ID (MRN)",
      enableSorting: true,
      className: "w-32",
      cell: (patient) => (
        <span className='font-semibold text-primary'>
          #{patient.hospitalNo}
        </span>
      ),
    },
    {
      id: "name",
      header: "Patient name",
      enableSorting: true,
      className: "min-w-48",
      cell: (patient) => (
        <div className='flex min-w-0 items-center gap-3'>
          <span
            className='flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-800'
            aria-hidden='true'
          >
            {getInitials(patient.name)}
          </span>
          <span className='font-medium text-slate-900'>{patient.name}</span>
        </div>
      ),
    },
    {
      id: "age",
      header: "Age / Sex",
      className: "w-24",
      cell: (patient) => {
        const age = getAge(new Date(patient.dob));
        return (
          <span className='text-slate-600'>
            {age === null ? "—" : age} / {patient.sex === "FEMALE" ? "F" : "M"}
          </span>
        );
      },
    },
    {
      id: "phone",
      header: "Phone number",
      className: "w-36",
      cell: (patient) => (
        <span className='text-slate-600'>{patient.phone || "—"}</span>
      ),
    },
    {
      id: "bloodGroup",
      header: "Blood group",
      className: "w-28",
      cell: (patient) =>
        patient.bloodGroup ? (
          <span className='rounded bg-blue-50 px-2 py-1 text-xs font-medium text-slate-700'>
            {patient.bloodGroup}
          </span>
        ) : (
          <span className='text-slate-400'>—</span>
        ),
    },
    {
      id: "lastVisit",
      header: "Last visit",
      className: "w-32",
      cell: (patient) => (
        <span className='text-slate-600'>
          {formatDateOnly(patient.lastVisit)}
        </span>
      ),
    },
    {
      id: "clinicalFlags",
      header: "Clinical flags",
      className: "w-40",
      cell: (patient) => <PatientClinicalFlag patient={patient} />,
    },
    {
      id: "actions",
      header: "Actions",
      className: "w-28 text-right",
      cell: (patient) => (
        <Link
          href={`/patients/${patient.id}`}
          className='inline-flex min-h-9 w-19 items-center justify-center gap-1 rounded-md border border-slate-300 bg-white px-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          aria-label={`View ${patient.name}'s profile`}
        >
          View profile
          <ArrowUpRight className='size-3.5' aria-hidden='true' />
        </Link>
      ),
    },
  ];
