import { getTeacherByUserId } from "@/actions/teachers";
import { auth } from "@/auth";
import { Stat } from "@/components/Stat";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatTime } from "@/lib/utils";

export default async function page() {
  const session = await auth();
  if (!session) return null;
  const teacher = await getTeacherByUserId(Number(session.user.id));
  if (!teacher) return null;

  return (
    <div>
      <h2 className="my-10 text-3xl font-bold">Bienvenido {session?.user.username}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat background="bg-sky-500" title="ID" value={Number(teacher.id) ?? 0} />
        <Stat
          background="bg-rose-500"
          title="Encargado del grado"
          value={teacher.grade?.name ?? null}
        />
      </div>
      <div className="mt-10">
        <h3 className="mb-4 text-2xl font-semibold">Mis materias</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Grado</TableHead>
              <TableHead>Materia</TableHead>
              <TableHead>Día</TableHead>
              <TableHead>Hora</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teacher.courses?.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.grade.name}</TableCell>
                <TableCell>{course.subject.name}</TableCell>
                <TableCell>{course.day}</TableCell>
                <TableCell>{formatTime(course.time)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
