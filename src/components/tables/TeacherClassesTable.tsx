"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatTime } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { Button } from "../ui/button";

export function TeacherClassesTable({
  courses,
  selectedCourse,
  selectCourse,
  showStudents,
}: {
  selectedCourse: number | null;
  selectCourse: (courseId: number) => void;
  courses: Prisma.CourseGetPayload<{ include: { subject: true; grade: true } }>[];
  showStudents: (gradeId: number) => void;
}) {
  function handleShowStudents(courseId: number, gradeId: number) {
    selectCourse(courseId);
    showStudents(gradeId);
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Materia</TableHead>
          <TableHead>Grado</TableHead>
          <TableHead>Dia</TableHead>
          <TableHead>Hora</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses?.map((course) => (
          <TableRow className={selectedCourse === course.id ? "bg-slate-400" : ""} key={course.id}>
            <TableCell>{course.subject.name}</TableCell>
            <TableCell>{course.grade.name}</TableCell>
            <TableCell>{course.day}</TableCell>
            <TableCell>{formatTime(course.time)}</TableCell>
            <TableCell>
              <Button
                disabled={selectedCourse === course.id}
                onClick={() => {
                  handleShowStudents(course.id, course.grade.id);
                }}
                size="sm"
              >
                Mostrar estudiantes
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
