"use client";
import { editCourse } from "@/actions/courses";
import { getAllGrades } from "@/actions/grades";
import { getAllSubjects } from "@/actions/subjects";
import { getAllTeachers } from "@/actions/teachers";
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
import { DaysEnum } from "@/enums";
import { courseSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course, Grade, Subject, Teacher } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
export function EditClassesFormModal({ courseToEdit }: { courseToEdit: Course }) {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      grade: courseToEdit.gradeId.toString(),
      teacher: courseToEdit.teacherId.toString(),
      subject: courseToEdit.subjectId.toString(),
      day: courseToEdit.day,
      time: courseToEdit.time,
    },
  });
  useEffect(() => {
    getAllTeachers().then((items) => setTeachers(items));
    getAllGrades().then((items) => setGrades(items));
    getAllSubjects().then((items) => setSubjects(items));
  }, []);
  async function onSubmit(values: z.infer<typeof courseSchema>) {
    const result = await editCourse({
      course: {
        day: values.day,
        time: values.time,
        grade: Number(values.grade),
        teacher: Number(values.teacher),
        subject: Number(values.subject),
      },
      id: courseToEdit.id,
    });
    if (result) {
      toast.success("Curso agregado!");
      router.refresh();
      setIsOpen(false);
    } else {
      toast.error("Error al agregar curso!");
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Editar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar clase</DialogTitle>
          <DialogDescription></DialogDescription>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                label="Profesor"
                control={form.control}
                name="teacher"
              >
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id.toString()}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </CustomFormField>
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                label="Materia"
                control={form.control}
                name="subject"
              >
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id.toString()}>
                    {subject.name}
                  </SelectItem>
                ))}
              </CustomFormField>
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
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                label="Día"
                control={form.control}
                name="day"
              >
                {Object.values(DaysEnum).map((day) => (
                  <SelectItem key={day} value={day}>
                    {day.toUpperCase()}
                  </SelectItem>
                ))}
              </CustomFormField>
              <CustomFormField
                fieldType={FormFieldType.TIME_PICKER}
                label="Hora"
                control={form.control}
                name="time"
              />
              <div className="flex justify-center">
                <Button disabled={form.formState.isSubmitting} type="submit">
                  Editar
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
