"use client";
import { getParentById } from "@/actions/parents";
import { deleteComment } from "@/actions/posts";
import { getTeacherById } from "@/actions/teachers";
import { AuthorModel, Comment, Parent, Teacher } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

export default function CommentCard({ comment }: { comment: Comment }) {
  const { data: session } = useSession();
  const [author, setAuthor] = useState<Teacher | Parent | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (comment.authorModel === AuthorModel.teacher) {
      getTeacherById(comment.authorId).then((teacher) => {
        if (!teacher) return;
        setAuthor(teacher);
      });
    } else {
      getParentById(comment.authorId).then((parent) => {
        if (!parent) return;
        setAuthor(parent);
      });
    }
  }, [comment.authorId, comment.authorModel]);

  async function handleDelete(id: number) {
    const result = await deleteComment(id);
    if (result) {
      toast.success("Comentario borrado!");
      router.refresh();
    } else {
      toast.error("Error al borrar comentario!");
    }
  }
  function instanceOfParent(author: any): author is Parent {
    return author && typeof author.fatherName === "string";
  }
  if (!author) return null;
  if (instanceOfParent(author)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {author.fatherName && `Padre: ${author.fatherName}`}{" "}
            {author.motherName && `Madre: ${author.motherName}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{comment.comment}</p>
        </CardContent>
        {session?.user.id === String(author.userId) && (
          <CardFooter>
            <div className="flex w-full justify-end gap-2">
              <Button
                onClick={() => {
                  handleDelete(comment.id);
                }}
                variant="destructive"
              >
                Borrar
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    );
  } else {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{author.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{comment.comment}</p>
        </CardContent>
        {session?.user.id === String(author.userId) && (
          <CardFooter>
            <div className="flex w-full justify-end gap-2">
              <Button
                onClick={() => {
                  handleDelete(comment.id);
                }}
                variant="destructive"
              >
                Borrar
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    );
  }
}
