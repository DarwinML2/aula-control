"use client";
import { getChartDataByStudent } from "@/actions/notes";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

// const chartData = [
//   { label: "Sem 1", value: 50 },
//   { label: "Sem 2", value: 20 },
// ];

const chartConfig = {
  value: {
    label: "Valor",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export default function StudentExamChart({ studentId }: { studentId: number }) {
  const [chartData, setChartData] = useState<any>([]);
  useEffect(() => {
    getChartDataByStudent(studentId).then((result) => {
      if (result) {
        const data: { label: string; value: number }[] = [
          {
            label: "Sem 1",
            value: 0,
          },
          { label: "Sem 2", value: 0 },
        ];
        let amount1 = 0;
        let amount2 = 0;
        result.forEach((note) => {
          if (note.average1) {
            const index = data.findIndex((item) => item.label === "Sem 1");
            if (index !== -1) {
              amount1++;
              data[index]["value"] += note.average1 ?? 0;
            }
          }
          if (note.average2) {
            const index = data.findIndex((item) => item.label === "Sem 2");
            if (index !== -1) {
              amount2++;
              data[index]["value"] += note.average2 ?? 0;
            }
          }
        });
        data[0]["value"] = amount1 > 0 ? data[0]["value"] / amount1 : 0;
        data[1]["value"] = amount2 > 0 ? data[1]["value"] / amount2 : 0;
        setChartData(data);
      }
    });
  }, [studentId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Promedio</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart layout="vertical" accessibilityLayer data={chartData}>
            <YAxis type="category" dataKey="label" axisLine={false} tickLine={false} />
            <XAxis type="number" dataKey="value" hide />
            <Bar dataKey="value" fill="var(--color-value)" radius={4}>
              <LabelList position="right" className="fill-foreground" />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
