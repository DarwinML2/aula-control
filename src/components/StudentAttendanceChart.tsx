// @ts-nocheck
"use client";
import { getChartDataByStudent } from "@/actions/attendance";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { MonthsEnum } from "@/enums";
import { useEffect, useState } from "react";
import { Bar, BarChart, LabelList, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

// const chartData = [
//   { month: "Enero", absence: 50, tardy: 20 },
//   { month: "Febrero", absence: 50, tardy: 20 },
//   { month: "Marzo", absence: 50, tardy: 20 },
//   { month: "Abril", absence: 50, tardy: 20 },
// ];

const chartConfig = {
  absence: {
    label: "Ausencias",
    color: "hsl(var(--chart-1))",
  },
  tardy: {
    label: "Tardanzas",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function StudentAttendanceChart({ studentId }: { studentId: number }) {
  const [chartData, setChartData] = useState<any>([]);
  useEffect(() => {
    getChartDataByStudent(studentId).then((result) => {
      if (result) {
        const absenceData = {};
        const tardyData = {};
        if (result.absences) {
          const absenceMonths = Object.groupBy(
            result.absences,
            (attendance) => attendance.date.getMonth() + 1,
          );

          for (const [month, absences] of Object.entries(absenceMonths)) {
            if (absences) {
              absenceData[MonthsEnum[month as number]] = absences.length;
            }
          }
        }
        if (result.tardy) {
          const tardyMonths = Object.groupBy(
            result.tardy,
            (attendance) => attendance.date.getMonth() + 1,
          );
          for (const [month, tardy] of Object.entries(tardyMonths)) {
            if (tardy) {
              tardyData[MonthsEnum[month]] = tardy.length;
            }
          }
        }
        const data: { month: string; absence: number; tardy: number }[] = [];
        Object.entries(absenceData).forEach(([key, value]) => {
          data.push({ month: key, absence: value, tardy: 0 });
        });
        Object.entries(tardyData).forEach(([key, value]) => {
          const index = data.findIndex((item) => item.month === key);
          if (index !== -1) {
            data[index]["tardy"] = value as number;
          } else {
            data.push({ month: key, absence: 0, tardy: value });
          }
        });
        data.sort(function (a, b) {
          return (
            Object.values(MonthsEnum).indexOf(a.month) - Object.values(MonthsEnum).indexOf(b.month)
          );
        });
        setChartData(data);
      }
    });
  }, [studentId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asistencias</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="">
          <BarChart accessibilityLayer data={chartData}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="tardy" fill="var(--color-tardy)" radius={4}>
              <LabelList position="centerTop" className="fill-foreground" />
            </Bar>
            <Bar dataKey="absence" fill="var(--color-absence)" radius={4}>
              <LabelList position="centerTop" className="fill-foreground" />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
