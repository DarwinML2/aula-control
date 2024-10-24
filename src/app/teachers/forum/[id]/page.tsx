import { getPostById } from "@/actions/posts";
import { auth } from "@/auth";
import CommentCard from "@/components/CommentCard";
import CommentForm from "@/components/CommentForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function page({ params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) return <div>No existe</div>;

  const post = await getPostById(Number(id));
  if (!post) return <div>No existe</div>;

  const session = await auth();
  if (!session) return null;

  return (
    <div>
      <Button variant="outline" asChild>
        <Link href={`/teachers/forum`}>Volver</Link>
      </Button>
      <div className="mt-4">
        <p className="font-bold">Profesor: {post.teacher.name}</p>
        <p className="font-bold">Grado: {post.grade.name}</p>
      </div>
      <section className="mt-8 space-y-4">
        <h1 className="leading-2 text-3xl font-bold">{post.title}</h1>
        <p className="text-pretty">{post.description}</p>
      </section>
      <div className="mt-8">
        <CommentForm postId={post.id} userId={Number(session.user.id)} />
      </div>
      {post.Comment.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Comentarios</h2>
          <div className="space-y-4">
            {post.Comment.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
