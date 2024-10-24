import { getTeacherByUserId } from "@/actions/teachers";
import { auth } from "@/auth";
import StudentsTeacher from "@/components/StudentsTeacher";

export default async function page() {
  const session = await auth();
  if (!session) return null;

  const teacher = await getTeacherByUserId(Number(session?.user.id));
  if (!teacher) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold">Classes</h1>
      <StudentsTeacher teacher={teacher} />
    </div>
  );
}
