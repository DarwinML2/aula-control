"use client";
import { getAttendanceByStudent } from "@/actions/attendance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatTime } from "@/lib/utils";
import { Prisma, type Student } from "@prisma/client";
import { useEffect, useState } from "react";

export default function StudentAttendance({ student }: { student: Student }) {
  const [attendances, setAttendances] = useState<
    Prisma.AttendanceGetPayload<{
      include: { attendanceOption: true; course: { include: { subject: true } } };
    }>[]
  >([]);
  useEffect(() => {
    getAttendanceByStudent(student.id).then((attendance) => {
      if (!attendance) return;
      setAttendances(attendance);
    });
  }, [student]);
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Materia</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Dia</TableHead>
            <TableHead>Hora</TableHead>
            <TableHead>Reporte</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendances?.map((attendance) => (
            <TableRow key={attendance.id}>
              <TableCell>{attendance.course.subject.name}</TableCell>
              <TableCell>{formatDate(attendance.date)}</TableCell>
              <TableCell>{attendance.course.day}</TableCell>
              <TableCell>{formatTime(attendance.course.time)}</TableCell>
              <TableCell>{attendance.attendanceOption.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
