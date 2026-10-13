import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PatientDirectoryRecord } from "@/types/patient-directory";

export function PatientClinicalFlag({
  patient,
}: {
  patient: PatientDirectoryRecord;
}) {
  const allergy = patient.allergies[0];
  const condition = patient.chronicConditions[0];
  const flag = allergy ? `${allergy} allergy` : condition;

  if (!flag) {
    return <span className='text-xs italic text-slate-500'>None noted</span>;
  }

  return (
    <Badge
      variant='outline'
      className='h-auto max-w-40 justify-start gap-1.5 whitespace-normal rounded-full border-red-200 bg-red-50 px-2.5 py-1 text-left text-[11px] font-medium leading-4 text-red-800'
      title={[...patient.allergies, ...patient.chronicConditions].join(", ")}
    >
      <AlertCircle
        className='size-3 shrink-0 fill-red-600 text-white'
        aria-hidden='true'
      />
      <span className='line-clamp-2'>{flag}</span>
    </Badge>
  );
}
