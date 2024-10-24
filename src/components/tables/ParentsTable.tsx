"use client";
import { deleteParent, forceDeleteParent, restoreParent } from "@/actions/parents";
import { ParentsFormModal } from "@/components/ParentsFormModal";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
type ParentsTableType = {
  parents: Prisma.ParentGetPayload<{ include: { user: true; students: true } }>[];
};
export default function ParentsTable({ parents }: ParentsTableType) {
  const router = useRouter();
  const handleDelete = async (id: number, forceDelete: boolean = false) => {
    toast.info("Cuenta eliminada!");
    if (forceDelete) {
      await forceDeleteParent(id);
    } else {
      await deleteParent(id);
    }
    router.refresh();
  };
  const handleRestore = async (id: number) => {
    toast.info("Cuenta restaurada!");
    await restoreParent(id);
    router.refresh();
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Padre</TableHead>
          <TableHead>Madre</TableHead>
          <TableHead>Usuario</TableHead>
          <TableHead>Estudiantes</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {parents?.map((parent) => (
          <TableRow key={parent.id}>
            <TableCell>{parent.fatherName}</TableCell>
            <TableCell>{parent.motherName}</TableCell>
            <TableCell>{parent.user.username}</TableCell>
            <TableCell>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/admin/parents/${parent.id}`}>{parent.students.length}</Link>
              </Button>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <ParentsFormModal mode="edit" parentToEdit={parent} />
                {parent.deleteAt !== null ? (
                  <>
                    <Button onClick={() => handleRestore(parent.id)} size="sm" variant="outline">
                      Restaurar
                    </Button>
                    <Button
                      onClick={() => handleDelete(parent.id, true)}
                      size="sm"
                      variant="destructive"
                    >
                      Forzar Eliminar
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => handleDelete(parent.id)} size="sm" variant="destructive">
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
