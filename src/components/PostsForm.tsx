"use client";
import { createPost } from "@/actions/posts";
import { postSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@prisma/client";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CustomFormField, FormFieldType } from "./CustomFormField";
import { Button } from "./ui/button";
import { Form } from "./ui/form";

export default function PostsForm({
  teacher,
}: {
  teacher: Prisma.TeacherGetPayload<{ include: { grade: true } }>;
}) {
  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof postSchema>) {
    if (!teacher.grade) return;
    console.log(teacher.grade);
    const result = await createPost({
      title: values.title,
      description: values.description,
      teacherId: teacher.id,
      gradeId: teacher.grade.name,
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
              name="title"
              label="Titulo"
              control={form.control}
              fieldType={FormFieldType.INPUT}
            />
            <CustomFormField
              name="description"
              label="Descripcion"
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
