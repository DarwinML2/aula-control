"use client";
import { deleteSubject, forceDeleteSubject, restoreSubject } from "@/actions/subjects";
import { SubjectFormModal } from "@/components/SubjectsFormModal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Subject } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SubjectTable({ subjects }: { subjects: Subject[] }) {
  const router = useRouter();
  const handleDelete = async (id: number, forceDelete: boolean = false) => {
    toast.info("Materia eliminada!");
    if (forceDelete) {
      await forceDeleteSubject(id);
    } else {
      await deleteSubject(id);
    }
    router.refresh();
  };
  const handleRestore = async (id: number) => {
    toast.info("Materia restaurada!");
    await restoreSubject(id);
    router.refresh();
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Materia</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subjects?.map((subject) => (
          <TableRow key={subject.id}>
            <TableCell>{subject.id}</TableCell>
            <TableCell>{subject.name}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <SubjectFormModal mode="edit" subjectToEdit={subject} />
                {subject.deleteAt !== null ? (
                  <>
                    <Button onClick={() => handleRestore(subject.id)} size="sm" variant="outline">
                      Restaurar
                    </Button>
                    <Button
                      onClick={() => handleDelete(subject.id, true)}
                      size="sm"
                      variant="destructive"
                    >
                      Forzar Eliminar
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => handleDelete(subject.id)} size="sm" variant="destructive">
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
