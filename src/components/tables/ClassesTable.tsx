"use client";
import { deleteCourse, forceDeleteCourse, restoreCourse } from "@/actions/courses";
import { Button } from "@/components/ui/button";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EditClassesFormModal } from "../formModals/edit/EditClassesFormModal";

export function ClassesTable({
  courses,
}: {
  courses: Prisma.CourseGetPayload<{ include: { teacher: true; subject: true; grade: true } }>[];
}) {
  const router = useRouter();
  const handleDeleteGrade = async (id: number, forceDelete: boolean = false) => {
    toast.info("Grado eliminado!");
    if (forceDelete) {
      await forceDeleteCourse(id);
    } else {
      await deleteCourse(id);
    }
    router.refresh();
  };
  const handleRestore = async (id: number) => {
    toast.info("Grado restaurado!");
    await restoreCourse(id);
    router.refresh();
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Profesor</TableHead>
          <TableHead>Materia</TableHead>
          <TableHead>Grado</TableHead>
          <TableHead>Dia</TableHead>
          <TableHead>Hora</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses?.map((course) => (
          <TableRow key={course.id}>
            <TableCell>{course.teacher.name}</TableCell>
            <TableCell>{course.subject.name}</TableCell>
            <TableCell>{course.grade.name}</TableCell>
            <TableCell>{course.day}</TableCell>
            <TableCell>{formatTime(course.time)}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <EditClassesFormModal courseToEdit={course} />
                {course.deleteAt !== null ? (
                  <>
                    <Button onClick={() => handleRestore(course.id)} size="sm" variant="outline">
                      Restaurar
                    </Button>
                    <Button
                      onClick={() => handleDeleteGrade(course.id, true)}
                      size="sm"
                      variant="destructive"
                    >
                      Eliminar
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => handleDeleteGrade(course.id)}
                    size="sm"
                    variant="destructive"
                  >
                    Deshabilitar
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
