"use client";

import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

export type DataTablePagination = { pageIndex: number; pageSize: number };
export type DataTableSort = { id: string; desc: boolean }[];

export type DataTableColumn<TData> = {
  id: string;
  header: ReactNode;
  cell: (row: TData) => ReactNode;
  enableSorting?: boolean;
  className?: string;
};

type DataTableProps<TData> = {
  data: TData[];
  columns: DataTableColumn<TData>[];
  pagination: DataTablePagination;
  onPaginationChange: (pagination: DataTablePagination) => void;
  sorting: DataTableSort;
  onSortingChange: (sorting: DataTableSort) => void;
  pageCount: number;
  totalCount: number;
  getRowId: (row: TData) => string;
  loading?: boolean;
  emptyMessage?: string;
  recordLabel?: string;
};

export function DataTable<TData>({
  data,
  columns,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  pageCount,
  totalCount,
  getRowId,
  loading = false,
  emptyMessage = "No records found.",
  recordLabel = "records",
}: DataTableProps<TData>) {
  const sortForColumn = (columnId: string) =>
    sorting.find((sort) => sort.id === columnId);

  function toggleSorting(columnId: string) {
    const current = sortForColumn(columnId);
    onSortingChange([{ id: columnId, desc: current ? !current.desc : false }]);
  }

  const firstRow =
    totalCount === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
  const lastRow = Math.min(
    (pagination.pageIndex + 1) * pagination.pageSize,
    totalCount,
  );

  return (
    <div className='overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm'>
      <div className='overflow-x-auto'>
        <Table className='min-w-230'>
          <TableHeader className='bg-blue-50/80'>
            <TableRow className='hover:bg-blue-50/80'>
              {columns.map((column) => {
                const activeSort = sortForColumn(column.id);
                return (
                  <TableHead
                    key={column.id}
                    className={`h-11 px-4 text-[11px] font-semibold uppercase tracking-wide text-slate-600 ${column.className ?? ""}`}
                  >
                    {column.enableSorting ? (
                      <button
                        type='button'
                        onClick={() => toggleSorting(column.id)}
                        className='inline-flex items-center gap-1.5 text-left hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                        aria-label={`Sort by ${typeof column.header === "string" ? column.header : column.id}`}
                      >
                        {column.header}
                        {activeSort ? (
                          activeSort.desc ? (
                            <ArrowDown
                              className='size-3.5'
                              aria-hidden='true'
                            />
                          ) : (
                            <ArrowUp className='size-3.5' aria-hidden='true' />
                          )
                        ) : (
                          <ArrowUpDown
                            className='size-3.5 opacity-50'
                            aria-hidden='true'
                          />
                        )}
                      </button>
                    ) : (
                      column.header
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-32 text-center text-sm text-muted-foreground'
                >
                  Loading patient records...
                </TableCell>
              </TableRow>
            ) : data.length ? (
              data.map((row, index) => (
                <TableRow
                  key={getRowId(row)}
                  className={index % 2 ? "bg-slate-50/60" : "bg-white"}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      className={`px-4 py-3 ${column.className ?? ""}`}
                    >
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-32 text-center text-sm text-muted-foreground'
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <footer className='flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between'>
        <p className='text-xs text-slate-600'>
          Showing{" "}
          <span className='font-semibold text-slate-900'>
            {firstRow}–{lastRow}
          </span>{" "}
          of{" "}
          <span className='font-semibold text-slate-900'>
            {totalCount.toLocaleString()}
          </span>{" "}
          {recordLabel}
        </p>
        <div className='flex flex-wrap items-center justify-between gap-3 sm:justify-end'>
          <label className='flex items-center gap-2 text-xs text-slate-600'>
            Rows per page
            <Select
              value={String(pagination.pageSize)}
              onValueChange={(value) =>
                onPaginationChange({ pageIndex: 0, pageSize: Number(value) })
              }
            >
              <SelectTrigger
                className='h-8 w-19 bg-white'
                aria-label='Rows per page'
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent align='end'>
                {[10, 20, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <div className='flex items-center gap-2'>
            <span className='min-w-20 text-center text-xs font-medium text-slate-600'>
              Page {pagination.pageIndex + 1} of {Math.max(pageCount, 1)}
            </span>
            <Button
              variant='outline'
              size='icon-sm'
              aria-label='Previous page'
              disabled={pagination.pageIndex <= 0 || loading}
              onClick={() =>
                onPaginationChange({
                  ...pagination,
                  pageIndex: pagination.pageIndex - 1,
                })
              }
            >
              <ChevronLeft aria-hidden='true' />
            </Button>
            <Button
              variant='outline'
              size='icon-sm'
              aria-label='Next page'
              disabled={pagination.pageIndex + 1 >= pageCount || loading}
              onClick={() =>
                onPaginationChange({
                  ...pagination,
                  pageIndex: pagination.pageIndex + 1,
                })
              }
            >
              <ChevronRight aria-hidden='true' />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
