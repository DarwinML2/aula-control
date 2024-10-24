import { getAllTeachersWithTrash } from "@/actions/teachers";
import { TeachersFormModal } from "@/components/TeachersFormModal";
import TeachersTable from "./_components/TeachersTable";

export default async function Page() {
  const teachers = await getAllTeachersWithTrash();
  return (
    <div className="mt-10">
      <h3 className="mb-4 text-2xl font-semibold">Profesores</h3>
      <TeachersFormModal />
      <div className="mt-4">
        {teachers ? <TeachersTable teachers={teachers} /> : "No hay cuentas"}
      </div>
    </div>
  );
}
