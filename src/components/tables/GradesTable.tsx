"use client";
import { deleteGrade, forceDeleteGrade, restoreGrade } from "@/actions/grades";
import { GradesFormModal } from "@/components/GradesFormModal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Grade } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function GradesTable({ grades }: { grades: Grade[] }) {
  const router = useRouter();
  const handleDeleteGrade = async (id: number, forceDelete: boolean = false) => {
    toast.info("Grado eliminado!");
    if (forceDelete) {
      await forceDeleteGrade(id);
    } else {
      await deleteGrade(id);
    }
    router.refresh();
  };
  const handleRestoreGrade = async (id: number) => {
    toast.info("Grado restaurado!");
    await restoreGrade(id);
    router.refresh();
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Grado</TableHead>
          <TableHead>Año</TableHead>
          <TableHead>Profesor</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {grades?.map((grade) => (
          <TableRow key={grade.id}>
            <TableCell>{grade.id}</TableCell>
            <TableCell>{grade.name}</TableCell>
            <TableCell>{grade.year}</TableCell>
            <TableCell>{grade.teacherId}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <GradesFormModal mode="edit" grade={grade} />
                {grade.deleteAt !== null ? (
                  <>
                    <Button
                      onClick={() => handleRestoreGrade(grade.id)}
                      size="sm"
                      variant="outline"
                    >
                      Restaurar
                    </Button>
                    <Button
                      onClick={() => handleDeleteGrade(grade.id, true)}
                      size="sm"
                      variant="destructive"
                    >
                      Forzar Eliminar
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => handleDeleteGrade(grade.id)}
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
