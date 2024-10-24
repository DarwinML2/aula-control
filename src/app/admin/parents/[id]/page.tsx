import { getParentById } from "@/actions/parents";
import { AddStudentFormModal } from "@/components/formModals/add/AddStudentFormModal";
import StudentsTable from "@/components/tables/StudentsTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function page({ params }: { params: { id: string } }) {
  const { id } = params;
  const parent = await getParentById(Number(id));

  if (!parent) return <div>No existe</div>;
  const familyLastname = `${parent.fatherLastname} ${parent.motherLastname || ""}`.trim();
  return (
    <>
      <h1 className="text-3xl font-bold">Familia {familyLastname}</h1>
      <div className="my-4 flex gap-2">
        <Button asChild variant="outline">
          <Link href={`/admin/parents`}>Volver</Link>
        </Button>
        <AddStudentFormModal parentId={parent.id} lastname={familyLastname} />
      </div>
      <StudentsTable students={parent.students} />
    </>
  );
}
