"use client";
import { Student } from "@prisma/client";
import { useState } from "react";
import StudentAttendance from "./StudentAttendance";
import StudentCalificationTable from "./StudentCalificationTable";
import StudentList from "./StudentList";
import StudentReportTable from "./StudentReportTable";
export type Mode = "calification" | "report" | "attendance" | null;
export default function Students({ students }: { students: Student[] }) {
  const [mode, setMode] = useState<Mode>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  function handleMode(mode: Mode, student: Student) {
    if (student) {
      setSelectedStudent(student);
    }
    setMode(mode);
  }
  return (
    <div>
      <h2 className="mb-4 text-3xl">Mis hijos</h2>
      <StudentList
        mode={mode}
        selectedStudent={selectedStudent}
        changeMode={handleMode}
        students={students}
      />
      <div className="mt-8">
        {mode === "calification" && selectedStudent && (
          <div>
            <h2 className="text-2xl font-semibold">Calificaciones</h2>
            <div>
              <StudentCalificationTable student={selectedStudent} />
            </div>
          </div>
        )}
        {mode === "report" && selectedStudent && (
          <div>
            <h2 className="text-2xl font-semibold">Reportes</h2>
            <div>
              <StudentReportTable student={selectedStudent} />
            </div>
          </div>
        )}
        {mode === "attendance" && selectedStudent && (
          <div>
            <h2 className="text-2xl font-semibold">Asistencias</h2>
            <div>
              <StudentAttendance student={selectedStudent} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
