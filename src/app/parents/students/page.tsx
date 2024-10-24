import { getParentByUserId } from "@/actions/parents";
import { auth } from "@/auth";
import Students from "@/components/Students";

export default async function page() {
  const session = await auth();
  if (!session) return null;
  const parent = await getParentByUserId(Number(session?.user.id));
  if (!parent) return null;

  return (
    <div>
      <Students students={parent.students} />
    </div>
  );
}
