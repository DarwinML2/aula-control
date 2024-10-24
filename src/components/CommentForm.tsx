"use client";
import { getParentByUserId } from "@/actions/parents";
import { createComment } from "@/actions/posts";
import { getTeacherByUserId } from "@/actions/teachers";
import { getUser } from "@/actions/users";
import { RoleEnum } from "@/enums";
import { commentSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthorModel, Prisma } from "@prisma/client";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CustomFormField, FormFieldType } from "./CustomFormField";
import { Button } from "./ui/button";
import { Form } from "./ui/form";

export default function CommentForm({ postId, userId }: { postId: number; userId: number }) {
  const [user, setUser] = useState<
    | Prisma.TeacherGetPayload<{ include: { user: true } }>
    | Prisma.ParentGetPayload<{ include: { user: true } }>
    | null
  >(null);

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: "",
    },
  });
  const router = useRouter();

  useEffect(() => {
    getUser({ id: Number(userId) }).then((user) => {
      if (!user) return;
      if (user.roleId === RoleEnum.TEACHER) {
        getTeacherByUserId(user.id).then((teacher) => {
          if (!teacher) return;
          setUser(teacher);
        });
      } else if (user.roleId === RoleEnum.PARENT) {
        getParentByUserId(user.id).then((parent) => {
          if (!parent) return;
          setUser(parent);
        });
      }
    });
  }, [userId]);

  async function onSubmit(values: z.infer<typeof commentSchema>) {
    console.log(userId, user);
    if (!userId || !user) return;
    const result = await createComment({
      comment: values.comment,
      postId,
      authorId: user.id,
      authorModel: user.user.roleId === RoleEnum.TEACHER ? AuthorModel.teacher : AuthorModel.parent,
    });
    if (result) {
      toast.success("Post agregado!");
      form.reset();
      router.refresh();
    } else {
      toast.error("Error al agregar post!");
    }
  }
  return (
    <div>
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <CustomFormField
              name="comment"
              label="Comentario"
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
            />
          </div>
          <div className="flex justify-center">
            <Button disabled={form.formState.isSubmitting} type="submit">
              <Save /> Guardar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
