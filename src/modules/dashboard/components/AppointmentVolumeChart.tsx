"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export type AppointmentTrendPoint = {
  day: string;
  date: string;
  appointments: number;
};

const chartConfig = {
  appointments: {
    label: "Appointments",
    color: "#1d4ed8",
  },
} satisfies ChartConfig;

export function AppointmentVolumeChart({
  data,
}: {
  data: AppointmentTrendPoint[];
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className='h-56 w-full'
      aria-label='Appointments over the last seven days'
    >
      <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray='3 3' />
        <XAxis
          dataKey='day'
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={34}
        />
        <ChartTooltip
          cursor={{ fill: "#eff6ff" }}
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) => payload?.[0]?.payload.date ?? ""}
              indicator='dot'
            />
          }
        />
        <Bar
          dataKey='appointments'
          fill='var(--color-appointments)'
          radius={[4, 4, 0, 0]}
          maxBarSize={34}
        />
      </BarChart>
    </ChartContainer>
  );
}
