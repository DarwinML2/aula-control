import { getParentByUserId } from "@/actions/parents";
import { getPostsByGradeId } from "@/actions/posts";
import { auth } from "@/auth";
import PostList from "@/components/PostList";

export default async function page() {
  const session = await auth();
  if (!session) return null;
  const parent = await getParentByUserId(Number(session?.user.id));
  if (!parent) return null;
  const grades = parent.students.map((student) => student.grade.name);
  const posts = await getPostsByGradeId(grades);
  return (
    <div>
      <h2 className="text-2xl font-semibold">Foro</h2>
      {posts.length > 0 ? (
        <div>
          <PostList isTeacher={false} posts={posts} />
        </div>
      ) : (
        <h2 className="text-2xl font-semibold">No hay posts</h2>
      )}
    </div>
  );
}
