import { getAllParentsWithTrash } from "@/actions/parents";
import { ParentsFormModal } from "@/components/ParentsFormModal";
import ParentsTable from "@/components/tables/ParentsTable";

export default async function Page() {
  const parents = await getAllParentsWithTrash();

  return (
    <>
      <h3 className="mb-4 text-3xl font-semibold">Padres</h3>
      <ParentsFormModal />
      <div className="mt-4">{parents ? <ParentsTable parents={parents} /> : "No hay cuentas"}</div>
    </>
  );
}
