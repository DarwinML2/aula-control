import { getAllCoursesWithTrash } from "@/actions/courses";
import { AddClassesFormModal } from "@/components/formModals/add/AddClassesFormModal";
import { ClassesTable } from "@/components/tables/ClassesTable";

export default async function Page() {
  const courses = await getAllCoursesWithTrash();

  return (
    <div className="mt-10">
      <h3 className="mb-4 text-2xl font-semibold">Clases</h3>
      <AddClassesFormModal />
      <div className="mt-4">{courses ? <ClassesTable courses={courses} /> : "No hay grados"}</div>
    </div>
  );
}
