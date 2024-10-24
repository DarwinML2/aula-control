"use client";
import { formatDate } from "@/lib/utils";
import { Student } from "@prisma/client";
import { type Mode } from "./Students";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export default function StudentList({
  students,
  mode,
  selectedStudent,
  changeMode,
}: {
  students: Student[];
  changeMode: (mode: Mode, student: Student) => void;
  selectedStudent: Student | null;
  mode: Mode;
}) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellidos</TableHead>
            <TableHead>Fecha de nacimiento</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students?.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.lastname}</TableCell>
              <TableCell>{formatDate(student.dob)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    disabled={
                      selectedStudent && mode === "calification"
                        ? selectedStudent.id === student.id
                        : false
                    }
                    onClick={() => changeMode("calification", student)}
                    size="sm"
                  >
                    Calificaciones
                  </Button>
                  <Button
                    disabled={
                      selectedStudent && mode === "attendance"
                        ? selectedStudent.id === student.id
                        : false
                    }
                    onClick={() => changeMode("attendance", student)}
                    size="sm"
                  >
                    Asistencias
                  </Button>
                  <Button
                    disabled={
                      selectedStudent && mode === "report"
                        ? selectedStudent.id === student.id
                        : false
                    }
                    onClick={() => changeMode("report", student)}
                    size="sm"
                  >
                    Reportes
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
