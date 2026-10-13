import { Card, CardContent } from "@/components/ui/card";
export function SummaryMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className='rounded-lg border-slate-200 shadow-sm'>
      <CardContent className='flex items-center gap-3 p-4'>
        <span className='rounded-md bg-blue-50 p-2 text-primary'>{icon}</span>
        <div>
          <p className='text-xs text-muted-foreground'>{label}</p>
          <p className='mt-0.5 text-xl font-semibold tabular-nums'>{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
