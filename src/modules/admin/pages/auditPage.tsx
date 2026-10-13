"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Eye,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type AuditLogRecord = {
  id: string;
  timestamp: string;
  tableName: string;
  recordId: string;
  action: string;
  oldValue: string | null;
  newValue: string | null;
  actor: { name: string; email: string; role: string };
  patient: { name: string; hospitalNo: string } | null;
};

export type AuditLogPageData = {
  logs: AuditLogRecord[];
  stats: {
    total: number;
    last24Hours: number;
    creates: number;
    changes: number;
  };
  filters: { query: string; action: string; entity: string; page: number };
  actions: string[];
  entities: string[];
  totalPages: number;
  filteredCount: number;
};

const numberFormatter = new Intl.NumberFormat();

function actionTone(action: string) {
  switch (action.toUpperCase()) {
    case "CREATE":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "UPDATE":
      return "border-sky-200 bg-sky-50 text-sky-800";
    case "DELETE":
      return "border-rose-200 bg-rose-50 text-rose-800";
    default:
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function valueEntries(value: string | null): [string, string][] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    const entries: [string, string][] = [];

    function collect(item: unknown, label: string) {
      if (item === null || item === undefined) {
        entries.push([label || "Value", "Not set"]);
      } else if (Array.isArray(item)) {
        if (item.length === 0) entries.push([label, "None"]);
        else
          item.forEach((entry, index) =>
            collect(entry, `${label} ${index + 1}`),
          );
      } else if (typeof item === "object") {
        const fields = Object.entries(item);
        if (fields.length === 0) entries.push([label, "No details"]);
        else {
          fields.forEach(([key, entry]) =>
            collect(entry, label ? `${label} / ${key}` : key),
          );
        }
      } else {
        entries.push([label || "Value", String(item)]);
      }
    }

    collect(parsed, "");
    return entries;
  } catch {
    return [["Value", value]];
  }
}

function pageHref(page: number, filters: AuditLogPageData["filters"]) {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.action) params.set("action", filters.action);
  if (filters.entity) params.set("entity", filters.entity);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/audit?${query}` : "/audit";
}

function Metric({
  label,
  value,
  note,
  icon,
}: {
  label: string;
  value: number;
  note: string;
  icon: React.ReactNode;
}) {
  return (
    <div className='flex min-w-0 items-start gap-3 border-l-2 border-slate-200 pl-4 first:border-l-emerald-500'>
      <span className='mt-0.5 text-slate-500'>{icon}</span>
      <div className='min-w-0'>
        <p className='text-xs font-medium text-slate-500'>{label}</p>
        <p className='mt-1 text-2xl font-semibold tabular-nums text-slate-950'>
          {numberFormatter.format(value)}
        </p>
        <p className='mt-0.5 text-xs text-slate-500'>{note}</p>
      </div>
    </div>
  );
}

export function AuditPage({
  logs,
  stats,
  filters,
  actions,
  entities,
  totalPages,
  filteredCount,
}: AuditLogPageData) {
  const [selectedLog, setSelectedLog] = useState<AuditLogRecord | null>(null);

  return (
    <main className='flex min-w-0 flex-1 flex-col gap-6 px-4 py-6 lg:px-8'>
      <header className='flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <div className='mb-2 flex items-center gap-2 text-xs font-medium text-slate-500'>
            <ShieldCheck
              className='size-4 text-emerald-700'
              aria-hidden='true'
            />
            <span>Governance / Activity records</span>
          </div>
          <h1 className='text-2xl font-semibold text-slate-950'>Audit log</h1>
          <p className='mt-1 max-w-2xl text-sm text-slate-600'>
            Review changes recorded across patient, encounter, and appointment
            data.
          </p>
        </div>
        <Badge
          variant='outline'
          className='w-fit gap-1.5 border-emerald-200 bg-emerald-50 text-emerald-800'
        >
          <Activity className='size-3' aria-hidden='true' />
          Database records
        </Badge>
      </header>

      <section
        aria-label='Audit log summary'
        className='grid gap-5 sm:grid-cols-2 xl:grid-cols-4'
      >
        <Metric
          label='All recorded events'
          value={stats.total}
          note='Across all tracked data'
          icon={<ClipboardList className='size-4' aria-hidden='true' />}
        />
        <Metric
          label='Last 24 hours'
          value={stats.last24Hours}
          note='Recent activity'
          icon={<Activity className='size-4' aria-hidden='true' />}
        />
        <Metric
          label='Records created'
          value={stats.creates}
          note='Create actions'
          icon={<span className='text-sm font-semibold'>+</span>}
        />
        <Metric
          label='Records changed'
          value={stats.changes}
          note='Updates and deletions'
          icon={
            <span className='text-sm font-semibold' aria-hidden='true'>
              ~
            </span>
          }
        />
      </section>

      <section className='overflow-hidden rounded-lg border border-slate-200 bg-white'>
        <form
          action='/audit'
          method='get'
          className='flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center'
          role='search'
        >
          <label className='relative min-w-0 flex-1'>
            <Search
              className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400'
              aria-hidden='true'
            />
            <Input
              name='q'
              defaultValue={filters.query}
              placeholder='Search staff, patient, action, or record ID'
              className='pl-9'
              aria-label='Search audit events'
            />
          </label>
          <div className='grid gap-3 sm:grid-cols-2 lg:flex'>
            <label className='sr-only' htmlFor='audit-action'>
              Action
            </label>
            <select
              id='audit-action'
              name='action'
              defaultValue={filters.action}
              className='h-9 min-w-36 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
            >
              <option value=''>All actions</option>
              {actions.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>
            <label className='sr-only' htmlFor='audit-entity'>
              Record type
            </label>
            <select
              id='audit-entity'
              name='entity'
              defaultValue={filters.entity}
              className='h-9 min-w-40 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
            >
              <option value=''>All record types</option>
              {entities.map((entity) => (
                <option key={entity} value={entity}>
                  {entity}
                </option>
              ))}
            </select>
            <Button type='submit' className='gap-2'>
              <Search className='size-4' aria-hidden='true' />
              Apply
            </Button>
          </div>
        </form>

        <div className='flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-xs text-slate-500'>
          <p>
            Showing {logs.length ? (filters.page - 1) * 25 + 1 : 0} -{" "}
            {Math.min(filters.page * 25, filteredCount)} of{" "}
            {numberFormatter.format(filteredCount)} matching events
          </p>
          {(filters.query || filters.action || filters.entity) && (
            <Link
              href='/audit'
              className='font-medium text-primary hover:underline'
            >
              Clear filters
            </Link>
          )}
        </div>

        <Table>
          <TableHeader className='bg-slate-50'>
            <TableRow>
              <TableHead className='pl-4'>Timestamp</TableHead>
              <TableHead>Staff member</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Record</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead className='pr-4 text-right'>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className='pl-4'>
                  <time
                    dateTime={log.timestamp}
                    className='block text-sm text-slate-800'
                  >
                    {formatDate(log.timestamp)}
                  </time>
                </TableCell>
                <TableCell>
                  <span className='block max-w-48 truncate font-medium text-slate-900'>
                    {log.actor.name}
                  </span>
                  <span className='block max-w-48 truncate text-xs text-slate-500'>
                    {log.actor.email}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant='outline' className={actionTone(log.action)}>
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className='block font-medium text-slate-800'>
                    {log.tableName}
                  </span>
                </TableCell>
                <TableCell>
                  {log.patient ? (
                    <span className='block max-w-40 truncate text-slate-800'>
                      {log.patient.name}
                    </span>
                  ) : (
                    <span className='text-slate-400'>Not linked</span>
                  )}
                </TableCell>
                <TableCell className='pr-4 text-right'>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='gap-1.5'
                    onClick={() => setSelectedLog(log)}
                    aria-label={`View details for ${log.action} ${log.tableName} record`}
                  >
                    <Eye className='size-4' aria-hidden='true' />
                    Inspect
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className='h-36 text-center text-sm text-slate-500'
                >
                  No audit events match these filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <footer className='flex items-center justify-between border-t border-slate-200 px-4 py-3'>
          <span className='text-xs text-slate-500'>
            Page {filters.page} of {Math.max(totalPages, 1)}
          </span>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              render={
                <Link href={pageHref(Math.max(filters.page - 1, 1), filters)} />
              }
              nativeButton={false}
              aria-label='Previous page'
              aria-disabled={filters.page <= 1}
              className={
                filters.page <= 1 ? "pointer-events-none opacity-50" : ""
              }
            >
              <ChevronLeft className='size-4' aria-hidden='true' />
              Previous
            </Button>
            <Button
              variant='outline'
              size='sm'
              render={
                <Link
                  href={pageHref(
                    Math.min(filters.page + 1, Math.max(totalPages, 1)),
                    filters,
                  )}
                />
              }
              nativeButton={false}
              aria-label='Next page'
              aria-disabled={filters.page >= totalPages}
              className={
                filters.page >= totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            >
              Next
              <ChevronRight className='size-4' aria-hidden='true' />
            </Button>
          </div>
        </footer>
      </section>

      <Sheet
        open={Boolean(selectedLog)}
        onOpenChange={(open) => !open && setSelectedLog(null)}
      >
        <SheetContent className='w-full overflow-y-auto sm:max-w-xl'>
          {selectedLog && (
            <>
              <SheetHeader className='border-b border-slate-200 pr-12'>
                <SheetTitle className='flex items-center gap-2'>
                  <Badge
                    variant='outline'
                    className={actionTone(selectedLog.action)}
                  >
                    {selectedLog.action}
                  </Badge>
                  {selectedLog.tableName}
                </SheetTitle>
                <SheetDescription>
                  {formatDate(selectedLog.timestamp)} by{" "}
                  {selectedLog.actor.name} ({selectedLog.actor.email})
                </SheetDescription>
              </SheetHeader>
              <div className='space-y-5 overflow-y-auto px-4 pb-6'>
                <div className='grid gap-3 sm:grid-cols-2'>
                  <Detail label='Record ID' value={selectedLog.recordId} />
                  <Detail label='Staff role' value={selectedLog.actor.role} />
                  <Detail
                    label='Patient'
                    value={selectedLog.patient?.name ?? "Not linked"}
                  />
                  <Detail
                    label='Hospital number'
                    value={selectedLog.patient?.hospitalNo ?? "Not linked"}
                  />
                </div>
                <ValueList
                  title='Previous value'
                  value={selectedLog.oldValue}
                />
                <ValueList
                  title='Recorded value'
                  value={selectedLog.newValue}
                />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className='min-w-0 border-b border-slate-200 pb-2'>
      <p className='text-xs font-medium text-slate-500'>{label}</p>
      <p className='mt-1 break-words text-sm text-slate-900'>{value}</p>
    </div>
  );
}

function ValueList({ title, value }: { title: string; value: string | null }) {
  const entries = valueEntries(value);

  return (
    <section>
      <h2 className='mb-2 text-sm font-semibold text-slate-900'>{title}</h2>
      {entries.length > 0 ? (
        <dl className='overflow-hidden rounded-md border border-slate-200'>
          {entries.map(([label, content], index) => (
            <div
              key={`${label}-${index}`}
              className='grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-3 border-b border-slate-200 px-3 py-2.5 last:border-b-0'
            >
              <dt className='break-words text-xs font-medium text-slate-500'>
                {label}
              </dt>
              <dd className='break-words text-sm text-slate-900'>{content}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className='rounded-md border border-slate-200 px-3 py-3 text-sm text-slate-500'>
          No value recorded
        </p>
      )}
    </section>
  );
}
