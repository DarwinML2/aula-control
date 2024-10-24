"use client";
import { deleteStudent, forceDeleteStudent, restoreStudent } from "@/actions/students";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EditStudentFormModal } from "../formModals/edit/EditStudentFormModal";

export default function StudentsTable({
  students,
}: {
  students: Prisma.StudentGetPayload<{ include: { grade: true } }>[];
}) {
  const router = useRouter();
  const handleDelete = async (id: number, forceDelete: boolean = false) => {
    toast.info("Cuenta eliminada!");
    if (forceDelete) {
      await forceDeleteStudent(id);
    } else {
      await deleteStudent(id);
    }
    router.refresh();
  };
  const handleRestore = async (id: number) => {
    toast.info("Cuenta restaurada!");
    await restoreStudent(id);
    router.refresh();
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Grado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students?.map((student) => (
          <TableRow key={student.id}>
            <TableCell>{student.name}</TableCell>
            <TableCell>{student.grade.name}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <EditStudentFormModal studentToEdit={student} />
                {student.deleteAt !== null ? (
                  <>
                    <Button onClick={() => handleRestore(student.id)} size="sm" variant="outline">
                      Restaurar
                    </Button>
                    <Button
                      onClick={() => handleDelete(student.id, true)}
                      size="sm"
                      variant="destructive"
                    >
                      Forzar Eliminar
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => handleDelete(student.id)} size="sm" variant="destructive">
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
