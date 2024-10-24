"use client";
import { getAllGrades } from "@/actions/grades";
import { createStudent } from "@/actions/students";
import { CustomFormField, FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { addStudentSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grade } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
export function AddStudentFormModal({
  parentId,
  lastname,
}: {
  parentId: number;
  lastname: string;
}) {
  const router = useRouter();
  const [grades, setGrades] = useState<Grade[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof addStudentSchema>>({
    resolver: zodResolver(addStudentSchema),
    defaultValues: {
      name: "",
      lastname,
      email: "",
      phone: "",
      dob: new Date(),
      grade: undefined,
    },
  });
  useEffect(() => {
    getAllGrades().then((items) => setGrades(items));
  }, []);
  async function onSubmit(values: z.infer<typeof addStudentSchema>) {
    const result = await createStudent({
      student: {
        name: values.name,
        lastname: values.lastname,
        phone: values.phone,
        email: values.email,
        dob: values.dob,
        grade: Number(values.grade),
      },
      parentId,
    });
    if (result) {
      toast.success("Estudiante agregado!");
      router.refresh();
      setIsOpen(false);
      form.reset();
    } else {
      console.log(result);
      toast.error("Error al agregar estudiante!");
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Agregar</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-3xl">
        <DialogHeader>
          <DialogTitle>Agregar estudiante</DialogTitle>
          <DialogDescription></DialogDescription>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex gap-2">
                <CustomFormField
                  name="name"
                  label="Nombre"
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                />
                <CustomFormField
                  name="lastname"
                  label="Apellido"
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                />
              </div>
              <div className="flex gap-2">
                <CustomFormField
                  name="email"
                  type="email"
                  label="Correo"
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                />
                <CustomFormField
                  name="phone"
                  label="Telefono"
                  control={form.control}
                  fieldType={FormFieldType.PHONE_INPUT}
                />
              </div>
              <CustomFormField
                name="dob"
                label="Fecha de nacimiento"
                control={form.control}
                fieldType={FormFieldType.DATE_PICKER}
              />
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                label="Grado"
                control={form.control}
                name="grade"
              >
                {grades.map((grade) => (
                  <SelectItem key={grade.id} value={grade.id.toString()}>
                    {grade.name}
                  </SelectItem>
                ))}
              </CustomFormField>
              <div className="flex justify-center">
                <Button type="submit">Agregar</Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
