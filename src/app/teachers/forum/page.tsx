import { getTeacherByUserId } from "@/actions/teachers";
import { auth } from "@/auth";
import PostList from "@/components/PostList";
import PostsForm from "@/components/PostsForm";

export default async function page() {
  const session = await auth();
  if (!session) return null;
  const teacher = await getTeacherByUserId(Number(session?.user.id));
  if (!teacher) return null;
  if (teacher.grade === null) return <h2>No tienes un grado asignado, no puedes crear posts</h2>;
  return (
    <div>
      <h2 className="text-2xl font-semibold">Foro</h2>
      <div>
        <PostsForm teacher={teacher} />
      </div>
      <div>
        <PostList posts={teacher.Post} />
      </div>
    </div>
  );
}
