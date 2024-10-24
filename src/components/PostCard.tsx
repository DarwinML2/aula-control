import { deletePost } from "@/actions/posts";
import { Prisma } from "@prisma/client";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

export default function PostCard({
  isTeacher = true,
  post,
}: {
  isTeacher?: boolean;
  post: Prisma.PostGetPayload<{ include: { grade: true } }>;
}) {
  const router = useRouter();
  async function handleDelete(id: number) {
    const result = await deletePost(id);
    if (result) {
      toast.success("Post borrado!");
      router.refresh();
    } else {
      toast.error("Error al borrar post!");
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-1">{post.description}</p>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2">
          {isTeacher && (
            <Button onClick={() => handleDelete(post.id)} variant="destructive">
              Borrar
            </Button>
          )}
          <Button asChild>
            <Link href={`/${isTeacher ? "teachers" : "parents"}/forum/${post.id}`}>
              Ver <Eye />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
