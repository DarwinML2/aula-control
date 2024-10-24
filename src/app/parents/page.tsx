import { getParentByUserId } from "@/actions/parents";
import { auth } from "@/auth";
import { Stat } from "@/components/Stat";
import StudentsChartsTable from "@/components/StudentsChartsTable";
export default async function page() {
  const session = await auth();
  const parent = await getParentByUserId(Number(session?.user.id));

  return (
    <div>
      <h2 className="my-10 text-3xl font-bold">
        Bienvenido familia {parent?.fatherLastname} {parent?.motherLastname}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat background="bg-sky-500" title="Hijos" value={parent?.students.length ?? 0} />
      </div>
      {parent?.students && (
        <div className="mt-10">
          <h3 className="mb-4 text-2xl font-semibold">Mis hijos</h3>
          <StudentsChartsTable students={parent.students} />
        </div>
      )}
    </div>
  );
}
