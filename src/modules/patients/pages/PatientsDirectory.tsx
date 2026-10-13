"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import {
  DataTable,
  type DataTablePagination,
  type DataTableSort,
} from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  PatientDirectoryFilters,
  type DirectorySortOption,
  type DirectoryVisitRange,
} from "@/modules/patients/components/PatientDirectoryFilters";
import { patientDirectoryColumns } from "@/modules/patients/components/patientDirectoryColumns";
import type { PatientDirectoryResponse } from "@/types/patient-directory";

const initialPagination: DataTablePagination = { pageIndex: 0, pageSize: 10 };
const initialSorting: DataTableSort = [{ id: "name", desc: false }];

export default function PatientDirectory() {
  const [patients, setPatients] = useState<
    PatientDirectoryResponse["patients"]
  >([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pagination, setPagination] = useState(initialPagination);
  const [sorting, setSorting] = useState(initialSorting);
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [condition, setCondition] = useState("");
  const [visitRange, setVisitRange] = useState<DirectoryVisitRange>("any");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setAppliedQuery(query.trim());
      setPagination((current) => ({ ...current, pageIndex: 0 }));
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [query]);

  const sortBy = (sorting[0]?.id ?? "name") as DirectorySortOption;
  const sortOrder = sorting[0]?.desc ? "desc" : "asc";

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      page: String(pagination.pageIndex + 1),
      pageSize: String(pagination.pageSize),
      sortBy,
      sortOrder,
    });
    if (appliedQuery) params.set("query", appliedQuery);
    if (condition) params.set("condition", condition);
    if (visitRange !== "any") {
      const start = new Date();
      start.setDate(start.getDate() - Number(visitRange));
      params.set("dateFrom", start.toISOString());
      params.set("dateTo", new Date().toISOString());
    }

    async function loadPatients() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/patients?${params.toString()}`, {
          signal: controller.signal,
        });
        const result = (await response.json()) as PatientDirectoryResponse & {
          error?: string;
        };
        if (!response.ok) {
          throw new Error(
            response.status === 401
              ? "Sign in to view patient records."
              : (result.error ?? "Could not load patient records."),
          );
        }
        setPatients(result.patients);
        setConditions(result.conditions);
        setTotalCount(result.pagination.total);
        setPageCount(result.pagination.totalPages);
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load patient records.",
        );
        setPatients([]);
        setTotalCount(0);
        setPageCount(0);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadPatients();
    return () => controller.abort();
  }, [
    appliedQuery,
    condition,
    pagination.pageIndex,
    pagination.pageSize,
    sortBy,
    sortOrder,
    visitRange,
  ]);

  function updateCondition(value: string) {
    setCondition(value);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  }

  function updateVisitRange(value: DirectoryVisitRange) {
    setVisitRange(value);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  }

  function updateSort(value: DirectorySortOption) {
    setSorting([{ id: value, desc: value === "createdAt" }]);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  }

  return (
    <main className='min-h-full bg-slate-50 px-4 py-5 sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-360 flex-col gap-5'>
        <header className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
          <div>
            <h1 className='text-2xl font-semibold tracking-tight text-slate-900'>
              Patients Directory
            </h1>
            <p className='mt-1 text-sm text-slate-600'>
              Manage, search, and review registered hospital patients and
              clinical profiles.
            </p>
          </div>
          <Button
            nativeButton={false}
            render={<Link href='/patients/new' />}
            className='h-10 gap-2 self-start px-4 sm:self-auto'
          >
            <UserPlus aria-hidden='true' />
            Register New Patient
          </Button>
        </header>

        <PatientDirectoryFilters
          query={query}
          onQueryChange={setQuery}
          condition={condition}
          onConditionChange={updateCondition}
          conditions={conditions}
          visitRange={visitRange}
          onVisitRangeChange={updateVisitRange}
          sortBy={sortBy}
          onSortByChange={updateSort}
        />

        {error && (
          <div
            role='alert'
            className='rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800'
          >
            {error}
          </div>
        )}

        <DataTable
          data={patients}
          columns={patientDirectoryColumns}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortingChange={(nextSorting) => {
            setSorting(nextSorting);
            setPagination((current) => ({ ...current, pageIndex: 0 }));
          }}
          pageCount={pageCount}
          totalCount={totalCount}
          getRowId={(patient) => patient.id}
          loading={loading}
          emptyMessage={
            error
              ? "Patient records are unavailable."
              : "No patients match these filters."
          }
          recordLabel='registered patients'
        />
      </div>
    </main>
  );
}
