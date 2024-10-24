"use client";
import { getReportsByStudent } from "@/actions/students";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { type Report, type Student } from "@prisma/client";
import { useEffect, useState } from "react";

export default function StudentReportTable({ student }: { student: Student }) {
  const [reports, setReports] = useState<Report[]>([]);
  useEffect(() => {
    getReportsByStudent(student.id).then((reports) => {
      if (!reports) return;
      setReports(reports);
    });
  }, [student]);
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Reporte</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports?.map((report) => (
            <TableRow key={report.id}>
              <TableCell>{formatDate(report.date)}</TableCell>
              <TableCell>{report.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
