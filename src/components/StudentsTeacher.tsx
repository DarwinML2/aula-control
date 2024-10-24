"use client";
import { getStudentsByGradeId } from "@/actions/students";
import { Prisma } from "@prisma/client";
import { useState } from "react";
import { TeacherClassesTable } from "./tables/TeacherClassesTable";
import TeacherStudentsTable from "./tables/TeacherStudentsTable";

export default function StudentsTeacher({
  teacher,
}: {
  teacher: Prisma.TeacherGetPayload<{
    include: { courses: { include: { subject: true; grade: true } } };
  }>;
}) {
  const [students, setStudents] = useState<
    Prisma.StudentGetPayload<{
      include: { parent: true; grade: true; Note: true; Attendance: true; Report: true };
    }>[]
  >([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  function selectCourse(courseId: number) {
    setSelectedCourse(courseId);
  }
  async function showStudents(gradeId: number) {
    const students = await getStudentsByGradeId(gradeId);
    setStudents(students);
  }
  async function refreshStudents(gradeId: number) {
    showStudents(gradeId);
  }
  return (
    <>
      <section className="mt-4">
        <h2 className="text-2xl font-semibold">Lista de clases</h2>
        <TeacherClassesTable
          selectedCourse={selectedCourse}
          selectCourse={selectCourse}
          showStudents={showStudents}
          courses={teacher.courses}
        />
      </section>
      {!selectedCourse && <h2>Seleccione una clase</h2>}

      {selectedCourse !== null && students.length === 0 && (
        <div className="mt-8 flex justify-center">
          <h2 className="text-2xl font-semibold">No hay estudiantes en esta clase</h2>
        </div>
      )}
      {selectedCourse !== null && students.length > 0 && (
        <section className="mt-4">
          <h2 className="text-2xl font-semibold">Lista de estudiantes</h2>
          <TeacherStudentsTable
            refreshStudents={refreshStudents}
            students={students}
            courseId={selectedCourse}
          />
        </section>
      )}
    </>
  );
}
