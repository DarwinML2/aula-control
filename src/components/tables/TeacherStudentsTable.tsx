"use client";
import { AddAttendanceFormModal } from "@/components/formModals/add/AddAttendanceFormModal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { compareDates } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { useEffect, useState } from "react";
import { EditAttendanceFormModal } from "../formModals/edit/EditAttendanceFormModal";
import StudentsCalifications from "../StudentsCalifications";
import StudentsReport from "../StudentsReport";

export default function TeacherStudentsTable({
  courseId,
  students,
  refreshStudents,
}: {
  courseId: number;
  students: Prisma.StudentGetPayload<{
    include: { grade: true; Attendance: true; Note: true; Report: true };
  }>[];
  refreshStudents: (gradeId: number) => void;
}) {
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [student, setStudent] =
    useState<
      Prisma.StudentGetPayload<{
        include: { grade: true; Attendance: true; Note: true; Report: true };
      }>
    >();
  const [mode, setMode] = useState<"calification" | "report" | null>(null);
  useEffect(() => {
    if (selectedStudent) {
      setStudent(students.find((student) => student.id === selectedStudent));
    }
  }, [selectedStudent, students]);
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellidos</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students?.map((student) => {
            let hasAttendance = false;
            const attendanceIndex = student.Attendance.findIndex(
              (attendance) => attendance.courseId === courseId,
            );
            if (attendanceIndex > -1) {
              const attendanceDate = student.Attendance[attendanceIndex].date;
              hasAttendance = compareDates(attendanceDate);
            }
            return (
              <TableRow
                className={selectedStudent === student.id ? "bg-slate-400" : ""}
                key={student.id}
              >
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.lastname}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {hasAttendance ? (
                      <EditAttendanceFormModal
                        attendance={student.Attendance[attendanceIndex]}
                        student={student}
                        courseId={courseId}
                      />
                    ) : (
                      <AddAttendanceFormModal
                        refreshStudents={refreshStudents}
                        student={student}
                        courseId={courseId}
                      />
                    )}
                    <Button
                      disabled={selectedStudent === student.id && mode === "calification"}
                      onClick={() => {
                        setMode("calification");
                        setSelectedStudent(student.id);
                      }}
                      size="sm"
                      className="bg-lime-700 hover:bg-lime-700/90"
                    >
                      Calificaciones
                    </Button>
                    <Button
                      disabled={selectedStudent === student.id && mode === "report"}
                      onClick={() => {
                        setMode("report");
                        setSelectedStudent(student.id);
                      }}
                      size="sm"
                      variant="destructive"
                    >
                      Reporte
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="mt-4">
        {student && mode === "calification" && (
          <StudentsCalifications courseId={courseId} student={student} />
        )}
        {student && mode === "report" && <StudentsReport student={student} />}
      </div>
    </div>
  );
}
