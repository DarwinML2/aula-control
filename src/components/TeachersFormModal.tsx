"use client";
import { getAllGrades } from "@/actions/grades";
import { getAllSubjects } from "@/actions/subjects";
import { createTeacher, editTeacher } from "@/actions/teachers";
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
import { teacherCreateSchema, teacherEditSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grade, Prisma, Subject } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
type TeacherWithUser = Prisma.TeacherGetPayload<{ include: { user: true; grade: true } }>;
interface TeachersFormModalProps {
  mode?: "new" | "edit";
  id?: number;
  teacherToEdit?: TeacherWithUser;
}
export function TeachersFormModal({
  mode = "new",
  teacherToEdit: itemToEdit,
}: TeachersFormModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const form = useForm<z.infer<typeof teacherEditSchema | typeof teacherCreateSchema>>({
    resolver: zodResolver(itemToEdit ? teacherEditSchema : teacherCreateSchema),
    defaultValues: {
      name: itemToEdit ? itemToEdit.name : "",
      lastname: itemToEdit ? itemToEdit.lastname : "",
      dob: itemToEdit ? itemToEdit.dob : undefined,
      email: itemToEdit ? itemToEdit.email : "",
      phone: itemToEdit ? itemToEdit.phone : "",
      username: itemToEdit ? itemToEdit.user.username : "",
      password: "",
      grade: itemToEdit ? itemToEdit?.grade?.name : "",
      knownSubjects: itemToEdit ? (itemToEdit.knownSubjects as string[]) : [],
    },
  });

  async function onSubmit(teacher: z.infer<typeof teacherEditSchema>) {
    console.log({ teacher });
    let result;
    if (mode === "new") {
      const { name, lastname, phone, email, dob, knownSubjects, grade, username, password } =
        teacher;

      result = await createTeacher({
        name,
        lastname,
        phone,
        email,
        dob,
        knownSubjects,
        grade,
        username,
        password,
      });
    } else {
      if (!itemToEdit) return;
      result = await editTeacher({ teacher, id: itemToEdit.id });
    }
    if (result) {
      toast.success(mode === "new" ? "Cuenta agregada!" : "Cuenta editada!");
      router.refresh();
      setIsOpen(false);
    } else {
      toast.error("Error al agregar materia");
    }
  }
  useEffect(() => {
    getAllGrades().then((items) => setGrades(items));
    getAllSubjects().then((items) => setSubjects(items));
  }, []);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={mode === "new" ? "default" : "sm"}>
          {mode === "new" ? "Agregar" : "Editar"}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "new" ? "Agregar profesor" : "Editar profesor"}</DialogTitle>
          <DialogDescription></DialogDescription>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex gap-2">
                <CustomFormField
                  control={form.control}
                  name="name"
                  label="Nombre"
                  fieldType={FormFieldType.INPUT}
                />
                <CustomFormField
                  control={form.control}
                  name="lastname"
                  label="Apellido"
                  fieldType={FormFieldType.INPUT}
                />
              </div>
              <div>
                <CustomFormField
                  control={form.control}
                  name="dob"
                  label="Fecha de nacimiento"
                  fieldType={FormFieldType.DATE_PICKER}
                />
              </div>
              <div className="flex gap-2">
                <CustomFormField
                  control={form.control}
                  name="email"
                  label="Correo electronico"
                  type="email"
                  fieldType={FormFieldType.INPUT}
                />
                <CustomFormField
                  control={form.control}
                  name="phone"
                  label="Número de celular"
                  fieldType={FormFieldType.PHONE_INPUT}
                />
              </div>

              <div>
                <h5 className="text-lg font-semibold">Usuario y contraseña</h5>
                <div className="flex gap-2">
                  <CustomFormField
                    label="Usuario"
                    control={form.control}
                    name="username"
                    fieldType={FormFieldType.INPUT}
                  />
                  <CustomFormField
                    label="Contraseña"
                    control={form.control}
                    name="password"
                    type="password"
                    fieldType={FormFieldType.INPUT}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <CustomFormField
                  label="Grado"
                  control={form.control}
                  name="grade"
                  fieldType={FormFieldType.SELECT}
                >
                  {grades.map((grade) => (
                    <SelectItem key={grade.name} value={grade.name}>
                      {grade.name}
                    </SelectItem>
                  ))}
                </CustomFormField>
                <CustomFormField
                  optionList={subjects.map((item) => ({ value: item.name, label: item.name }))}
                  label="Materias que puede impartir"
                  control={form.control}
                  name="knownSubjects"
                  variant="secondary"
                  fieldType={FormFieldType.MULTI_SELECT}
                />
              </div>
              <div className="flex justify-center">
                <Button disabled={form.formState.isSubmitting} type="submit">
                  {mode === "new" ? "Agregar" : "Editar"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
