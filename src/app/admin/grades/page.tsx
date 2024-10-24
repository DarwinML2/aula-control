import { getAllGradesWithTrash } from "@/actions/grades";
import { GradesFormModal } from "@/components/GradesFormModal";
import { GradesTable } from "@/components/tables/GradesTable";

export default async function Page() {
  const grades = await getAllGradesWithTrash();

  return (
    <div className="mt-10">
      <h3 className="mb-4 text-2xl font-semibold">Grados</h3>
      <GradesFormModal />
      <div className="mt-4">{grades ? <GradesTable grades={grades} /> : "No hay grados"}</div>
    </div>
  );
}
