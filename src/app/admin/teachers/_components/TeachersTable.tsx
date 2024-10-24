"use client";
import { deleteTeacher, forceDeleteTeacher, restoreTeacher } from "@/actions/teachers";
import { TeachersFormModal } from "@/components/TeachersFormModal";
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
type TeachersTableType = {
  teachers: Prisma.TeacherGetPayload<{ include: { user: true; grade: true } }>[];
};
export default function TeachersTable({ teachers }: TeachersTableType) {
  const router = useRouter();
  const handleDelete = async (id: number, forceDelete: boolean = false) => {
    toast.info("Cuenta eliminada!");
    if (forceDelete) {
      await forceDeleteTeacher(id);
    } else {
      await deleteTeacher(id);
    }
    router.refresh();
  };
  const handleRestore = async (id: number) => {
    toast.info("Cuenta restaurada!");
    await restoreTeacher(id);
    router.refresh();
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Apellido</TableHead>
          <TableHead>Usuario</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teachers?.map((teacher) => (
          <TableRow key={teacher.id}>
            <TableCell>{teacher.id}</TableCell>
            <TableCell>{teacher.name}</TableCell>
            <TableCell>{teacher.lastname}</TableCell>
            <TableCell>{teacher.user.username}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <TeachersFormModal mode="edit" teacherToEdit={teacher} />
                {teacher.deleteAt !== null ? (
                  <>
                    <Button onClick={() => handleRestore(teacher.id)} size="sm" variant="outline">
                      Restaurar
                    </Button>
                    <Button
                      onClick={() => handleDelete(teacher.id, true)}
                      size="sm"
                      variant="destructive"
                    >
                      Forzar Eliminar
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => handleDelete(teacher.id)} size="sm" variant="destructive">
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
