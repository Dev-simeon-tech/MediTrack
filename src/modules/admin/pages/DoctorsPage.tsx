"use client";

import { useState } from "react";
import { Building2, Search, Stethoscope, UserRoundCheck } from "lucide-react";
import { AddDoctorDialog } from "@/modules/admin/components/AddDoctorDialog";
import {
  DataTable,
  type DataTableColumn,
  type DataTablePagination,
  type DataTableSort,
} from "@/components/data-table";

export type DoctorDirectoryRecord = {
  id: string;
  name: string;
  email: string;
  mustChangePassword: boolean;
  createdAt: string;
  profile: {
    phone: string;
    medicalLicenseNo: string;
    specialization: string;
    dateOfBirth: string | null;
    gender: string | null;
    assignedUnit: string | null;
  } | null;
};

const initialPagination: DataTablePagination = { pageIndex: 0, pageSize: 10 };

export function DoctorsPage({ doctors }: { doctors: DoctorDirectoryRecord[] }) {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [pagination, setPagination] = useState(initialPagination);
  const [sorting, setSorting] = useState<DataTableSort>([
    { id: "createdAt", desc: true },
  ]);

  const departments = Array.from(
    new Set(
      doctors
        .map((doctor) => doctor.profile?.specialization)
        .filter((value): value is string => Boolean(value)),
    ),
  ).sort((left, right) => left.localeCompare(right));
  const normalizedQuery = query.trim().toLowerCase();
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesQuery =
      !normalizedQuery ||
      [
        doctor.name,
        doctor.email,
        doctor.profile?.specialization,
        doctor.profile?.medicalLicenseNo,
        doctor.profile?.assignedUnit,
      ].some((value) => value?.toLowerCase().includes(normalizedQuery));
    const matchesDepartment =
      department === "all" || doctor.profile?.specialization === department;
    return matchesQuery && matchesDepartment;
  });

  const activeCount = doctors.filter(
    (doctor) => !doctor.mustChangePassword,
  ).length;
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const addedThisMonth = doctors.filter(
    (doctor) => new Date(doctor.createdAt) >= monthStart,
  ).length;

  const columns: DataTableColumn<DoctorDirectoryRecord>[] = [
    {
      id: "name",
      header: "Doctor",
      enableSorting: true,
      className: "min-w-64",
      cell: (doctor) => {
        const initials = doctor.name
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part[0])
          .join("")
          .toUpperCase();
        return (
          <div className='flex items-center gap-3'>
            <span className='flex size-9 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-xs font-bold text-blue-800'>
              {initials}
            </span>
            <span className='min-w-0'>
              <span className='block truncate font-semibold text-slate-900'>
                {doctor.name}
              </span>
              <span className='block truncate font-mono text-[11px] text-slate-500'>
                {doctor.profile?.medicalLicenseNo ?? "License not provided"}
                {doctor.profile?.assignedUnit
                  ? ` · ${doctor.profile.assignedUnit}`
                  : ""}
              </span>
            </span>
          </div>
        );
      },
    },
    {
      id: "email",
      header: "Hospital Email",
      enableSorting: true,
      className: "min-w-56",
      cell: (doctor) => (
        <span className='text-sm text-slate-700'>{doctor.email}</span>
      ),
    },
    {
      id: "specialization",
      header: "Specialization",
      enableSorting: true,
      className: "min-w-44",
      cell: (doctor) => (
        <span className='inline-flex max-w-full rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800'>
          {doctor.profile?.specialization ?? "Not assigned"}
        </span>
      ),
    },
    {
      id: "phone",
      header: "Phone",
      className: "min-w-40",
      cell: (doctor) => (
        <span className='text-sm text-slate-700'>
          {doctor.profile?.phone ?? "Not provided"}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      enableSorting: true,
      className: "min-w-36",
      cell: (doctor) => (
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${doctor.mustChangePassword ? "border-amber-200 bg-amber-50 text-amber-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}
        >
          <span
            className={`mr-1.5 size-1.5 rounded-full ${doctor.mustChangePassword ? "bg-amber-600" : "bg-emerald-600"}`}
          />
          {doctor.mustChangePassword ? "Setup pending" : "Active"}
        </span>
      ),
    },
    {
      id: "createdAt",
      header: "Date Added",
      enableSorting: true,
      className: "min-w-36",
      cell: (doctor) => (
        <time dateTime={doctor.createdAt} className='text-sm text-slate-600'>
          {new Date(doctor.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
      ),
    },
  ];

  const sortValue = (doctor: DoctorDirectoryRecord, id: string) => {
    switch (id) {
      case "name":
        return doctor.name;
      case "email":
        return doctor.email;
      case "specialization":
        return doctor.profile?.specialization ?? "";
      case "status":
        return doctor.mustChangePassword ? "pending" : "active";
      case "createdAt":
      default:
        return doctor.createdAt;
    }
  };
  const sortedDoctors = [...filteredDoctors].sort((left, right) => {
    const activeSort = sorting[0];
    if (!activeSort) return 0;
    const result = String(sortValue(left, activeSort.id)).localeCompare(
      String(sortValue(right, activeSort.id)),
      undefined,
      { numeric: true, sensitivity: "base" },
    );
    return activeSort.desc ? -result : result;
  });
  const pageCount = Math.ceil(sortedDoctors.length / pagination.pageSize);
  const visibleDoctors = sortedDoctors.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize,
  );

  function resetPage() {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  }

  return (
    <div className='flex flex-1 flex-col gap-5 px-4 py-5 lg:px-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-slate-950'>Doctors</h1>
          <p className='mt-1 text-sm text-slate-600'>
            Manage doctor accounts, clinical details, and portal access.
          </p>
        </div>
        <AddDoctorDialog />
      </div>

      <section
        aria-label='Doctor directory summary'
        className='grid grid-cols-1 gap-3 sm:grid-cols-3'
      >
        <Metric
          label='Total Doctors'
          value={doctors.length}
          detail='Provider accounts in the directory'
          icon={<Stethoscope aria-hidden='true' />}
          iconClassName='bg-blue-50 text-blue-800'
        />
        <Metric
          label='Active Accounts'
          value={activeCount}
          detail={`${doctors.length - activeCount} awaiting first sign-in`}
          icon={<UserRoundCheck aria-hidden='true' />}
          iconClassName='bg-emerald-50 text-emerald-800'
        />
        <Metric
          label='Added This Month'
          value={addedThisMonth}
          detail={`${departments.length} ${departments.length === 1 ? "department" : "departments"} represented`}
          icon={<Building2 aria-hidden='true' />}
          iconClassName='bg-sky-50 text-sky-800'
        />
      </section>

      <section aria-label='Doctor directory' className='space-y-3'>
        <div className='flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center'>
          <div className='relative min-w-0 flex-1'>
            <Search
              aria-hidden='true'
              className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500'
            />
            <input
              type='search'
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                resetPage();
              }}
              placeholder='Search name, email, license, or unit'
              aria-label='Search doctors'
              className='h-9 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus-visible:border-blue-700 focus-visible:ring-3 focus-visible:ring-blue-700/15'
            />
          </div>
          <label className='flex shrink-0 items-center gap-2 text-sm text-slate-600'>
            <span className='sr-only'>Filter by department</span>
            <select
              value={department}
              onChange={(event) => {
                setDepartment(event.target.value);
                resetPage();
              }}
              className='h-9 w-full min-w-48 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none focus-visible:border-blue-700 focus-visible:ring-3 focus-visible:ring-blue-700/15'
            >
              <option value='all'>All departments</option>
              {departments.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <DataTable
          data={visibleDoctors}
          columns={columns}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortingChange={setSorting}
          pageCount={pageCount}
          totalCount={sortedDoctors.length}
          getRowId={(doctor) => doctor.id}
          emptyMessage={
            doctors.length === 0
              ? "No doctors have been added yet. Use Add Doctor to create the first account."
              : "No doctors match the current search or department filter."
          }
          recordLabel='doctors'
        />
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
  icon,
  iconClassName,
}: {
  label: string;
  value: number;
  detail: string;
  icon: React.ReactNode;
  iconClassName: string;
}) {
  return (
    <div className='flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm'>
      <div className='min-w-0'>
        <p className='text-xs font-semibold uppercase text-slate-500'>
          {label}
        </p>
        <p className='mt-1 text-2xl font-bold tabular-nums text-slate-950'>
          {value.toLocaleString()}
        </p>
        <p className='mt-1 text-xs text-slate-600'>{detail}</p>
      </div>
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-lg border border-current/10 ${iconClassName}`}
      >
        {icon}
      </span>
    </div>
  );
}
