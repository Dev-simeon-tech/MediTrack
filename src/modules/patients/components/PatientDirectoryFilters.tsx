"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type DirectoryVisitRange = "any" | "30" | "90" | "365";
export type DirectorySortOption = "name" | "hospitalNo" | "createdAt";

type PatientDirectoryFiltersProps = {
  query: string;
  onQueryChange: (query: string) => void;
  condition: string;
  onConditionChange: (condition: string) => void;
  conditions: string[];
  visitRange: DirectoryVisitRange;
  onVisitRangeChange: (range: DirectoryVisitRange) => void;
  sortBy: DirectorySortOption;
  onSortByChange: (sortBy: DirectorySortOption) => void;
};

export function PatientDirectoryFilters({
  query,
  onQueryChange,
  condition,
  onConditionChange,
  conditions,
  visitRange,
  onVisitRangeChange,
  sortBy,
  onSortByChange,
}: PatientDirectoryFiltersProps) {
  return (
    <section className='grid gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm md:grid-cols-[minmax(220px,1fr)_150px_160px_190px] md:items-center md:p-4'>
      <div className='relative'>
        <Search
          className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400'
          aria-hidden='true'
        />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder='Filter by name or hospital ID...'
          aria-label='Filter patients by name or hospital ID'
          className='h-10 bg-white pl-9'
        />
      </div>
      <Select
        value={condition || "all"}
        onValueChange={(value) =>
          onConditionChange(value === "all" || value === null ? "" : value)
        }
      >
        <SelectTrigger
          className='h-10 w-full bg-white'
          aria-label='Filter by clinical condition'
        >
          <SelectValue placeholder='Condition: All' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>Condition: All</SelectItem>
          {conditions.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={visitRange}
        onValueChange={(value) =>
          onVisitRangeChange((value ?? "any") as DirectoryVisitRange)
        }
      >
        <SelectTrigger
          className='h-10 w-full bg-white'
          aria-label='Filter by last visit'
        >
          <SelectValue placeholder='Last visit: Any time' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='any'>Last visit: Any time</SelectItem>
          <SelectItem value='30'>Last 30 days</SelectItem>
          <SelectItem value='90'>Last 90 days</SelectItem>
          <SelectItem value='365'>Last 12 months</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={sortBy}
        onValueChange={(value) =>
          onSortByChange((value ?? "name") as DirectorySortOption)
        }
      >
        <SelectTrigger
          className='h-10 w-full bg-white'
          aria-label='Sort patients'
        >
          <span className='mr-1 text-xs text-muted-foreground'>Sort by:</span>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='name'>Patient name</SelectItem>
          <SelectItem value='hospitalNo'>Hospital ID</SelectItem>
          <SelectItem value='createdAt'>Recently registered</SelectItem>
        </SelectContent>
      </Select>
    </section>
  );
}
