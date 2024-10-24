"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Prisma } from "@prisma/client";
import { EyeIcon, EyeOff } from "lucide-react";
import { useState } from "react";
import StudentAttendanceChart from "./StudentAttendanceChart";
import StudentExamChart from "./StudentExamChart";
import { Button } from "./ui/button";
export default function StudentsChartsTable({
  students,
}: {
  students: Prisma.StudentGetPayload<{ include: { grade: true } }>[];
}) {
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Grado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.grade.name}</TableCell>
              <TableCell>
                <Button
                  variant={selectedStudent === student.id ? "outline" : "default"}
                  onClick={() => {
                    if (selectedStudent === student.id) {
                      setSelectedStudent(null);
                    } else {
                      setSelectedStudent(student.id);
                    }
                  }}
                >
                  {selectedStudent === student.id ? (
                    <>
                      Cerrar <EyeOff className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Ver <EyeIcon className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedStudent && (
        <div className="mt-10 grid grid-cols-2 gap-2">
          <StudentAttendanceChart studentId={selectedStudent} />
          <StudentExamChart studentId={selectedStudent} />
        </div>
      )}
    </div>
  );
}
