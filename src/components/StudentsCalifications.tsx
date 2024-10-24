"use client";

import { getCourseById } from "@/actions/courses";
import { getStudentNote } from "@/actions/notes";
import { addNoteToStudent } from "@/actions/students";
import { CustomFormField, FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calificationSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function StudentsCalifications({
  courseId,
  student,
}: {
  courseId: number;
  student: Prisma.StudentGetPayload<{ include: { grade: true; Attendance: true; Note: true } }>;
}) {
  const [course, setCourse] = useState<Prisma.CourseGetPayload<{
    include: { subject: true; grade: true; teacher: true };
  }> | null>();

  const router = useRouter();
  const form = useForm<z.infer<typeof calificationSchema>>({
    resolver: zodResolver(calificationSchema),
    defaultValues: {
      note1: "",
      note2: "",
      note3: "",
      note4: "",
      exam1: "",
      note5: "",
      note6: "",
      note7: "",
      note8: "",
      exam2: "",
      average1: "",
      average2: "",
    },
  });
  const { watch } = form;
  useEffect(() => {
    getCourseById(courseId).then((course) => {
      setCourse(course);
    });
  }, [courseId]);
  useEffect(() => {
    if (course) {
      getStudentNote(student.id, course.subjectId).then((note) => {
        if (note) {
          form.setValue("note1", String(note.note1));
          form.setValue("note2", String(note.note2));
          form.setValue("note3", String(note.note3));
          form.setValue("note4", String(note.note4));
          form.setValue("exam1", String(note.exam1));
          form.setValue("note5", String(note.note5));
          form.setValue("note6", String(note.note6));
          form.setValue("note7", String(note.note7));
          form.setValue("note8", String(note.note8));
          form.setValue("exam2", String(note.exam2));
        } else {
          form.setValue("note1", "");
          form.setValue("note2", "");
          form.setValue("note3", "");
          form.setValue("note4", "");
          form.setValue("exam1", "");
          form.setValue("note5", "");
          form.setValue("note6", "");
          form.setValue("note7", "");
          form.setValue("note8", "");
          form.setValue("exam2", "");
        }
      });
    }
  }, [course, student, form]);

  useEffect(() => {
    const { unsubscribe } = watch((values, { name }) => {
      if (name === "average1" || name === "average2") {
        return;
      }
      console.log(values);
      const { note1, note2, note3, note4, note5, note6, note7, note8 } = values;
      let average1AmountOfnotes = 0;
      let average2AmountOfnotes = 0;
      let notes1 = 0;
      let notes2 = 0;
      if (note1 && note1 !== "null") {
        average1AmountOfnotes++;
        notes1 += Number(note1);
      }
      if (note2 && note2 !== "null") {
        average1AmountOfnotes++;
        notes1 += Number(note2);
      }
      if (note3 && note3 !== "null") {
        average1AmountOfnotes++;
        notes1 += Number(note3);
      }
      if (note4 && note4 !== "null") {
        average1AmountOfnotes++;
        notes1 += Number(note4);
      }
      if (note5 && note5 !== "null") {
        average2AmountOfnotes++;
        notes2 += Number(note5);
      }
      if (note6 && note6 !== "null") {
        average2AmountOfnotes++;
        notes2 += Number(note6);
      }
      if (note7 && note7 !== "null") {
        average2AmountOfnotes++;
        notes2 += Number(note7);
      }
      if (note8 && note8 !== "null") {
        average2AmountOfnotes++;
        notes2 += Number(note8);
      }

      const average1 = average1AmountOfnotes === 0 ? "" : notes1 / average1AmountOfnotes;
      const average2 = average2AmountOfnotes === 0 ? "" : notes2 / average2AmountOfnotes;

      form.setValue("average1", average1 !== "" ? String(Math.ceil(average1)) : "");
      form.setValue("average2", average2 !== "" ? String(Math.ceil(average2)) : "");
    });
    return () => unsubscribe();
  }, [watch, form]);
  async function onSubmit(values: z.infer<typeof calificationSchema>) {
    if (!course) return;
    const result = await addNoteToStudent({
      studentId: student.id,
      subjectId: course?.subjectId,
      note1: values.note1 ? Number(values.note1) : null,
      note2: values.note2 ? Number(values.note2) : null,
      note3: values.note3 ? Number(values.note3) : null,
      note4: values.note4 ? Number(values.note4) : null,
      exam1: values.exam1 ? Number(values.exam1) : null,
      note5: values.note5 ? Number(values.note5) : null,
      note6: values.note6 ? Number(values.note6) : null,
      note7: values.note7 ? Number(values.note7) : null,
      note8: values.note8 ? Number(values.note8) : null,
      exam2: values.exam2 ? Number(values.exam2) : null,
      average1: values.average1 ? Number(values.average1) : null,
      average2: values.average2 ? Number(values.average2) : null,
    });
    if (result) {
      toast.success("Calificaciones agregadas!");
      router.refresh();
    } else {
      toast.error("Error al agregar calificaciones!");
    }
  }
  return (
    <div>
      <h3 className="mb-t text-2xl font-semibold">
        Calificaciones del(a) estudiante {student.name} {student.lastname}
      </h3>
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center" colSpan={5}>
                  Primer cuatrimestre
                </TableHead>
                <TableHead className="text-center" colSpan={5}>
                  Segundo cuatrimestre
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="text-center">Nota 1</TableHead>
                <TableHead className="text-center">Nota 2</TableHead>
                <TableHead className="text-center">Nota 3</TableHead>
                <TableHead className="text-center">Nota 4</TableHead>
                <TableHead className="border-r text-center">Examen</TableHead>
                <TableHead className="text-center">Nota 1</TableHead>
                <TableHead className="text-center">Nota 2</TableHead>
                <TableHead className="text-center">Nota 3</TableHead>
                <TableHead className="text-center">Nota 4</TableHead>
                <TableHead className="text-center">Examen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    type="number"
                    control={form.control}
                    name="note1"
                    max={100}
                    min={0}
                  />
                </TableCell>
                <TableCell>
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    type="number"
                    control={form.control}
                    name="note2"
                    max={100}
                    min={0}
                  />
                </TableCell>
                <TableCell>
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    type="number"
                    control={form.control}
                    name="note3"
                    max={100}
                    min={0}
                  />
                </TableCell>
                <TableCell>
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    type="number"
                    control={form.control}
                    name="note4"
                    max={100}
                    min={0}
                  />
                </TableCell>
                <TableCell>
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    type="number"
                    control={form.control}
                    name="exam1"
                    max={100}
                    min={0}
                  />
                </TableCell>
                <TableCell>
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    type="number"
                    control={form.control}
                    name="note5"
                    max={100}
                    min={0}
                  />
                </TableCell>
                <TableCell>
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    type="number"
                    control={form.control}
                    name="note6"
                    max={100}
                    min={0}
                  />
                </TableCell>
                <TableCell>
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    type="number"
                    control={form.control}
                    name="note7"
                    max={100}
                    min={0}
                  />
                </TableCell>
                <TableCell>
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    type="number"
                    control={form.control}
                    name="note8"
                    max={100}
                    min={0}
                  />
                </TableCell>
                <TableCell>
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    type="number"
                    control={form.control}
                    name="exam2"
                    max={100}
                    min={0}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="mx-auto max-w-[100px]">
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      type="number"
                      control={form.control}
                      name="average1"
                      readonly
                      max={100}
                      min={0}
                    />
                  </div>
                </TableCell>
                <TableCell colSpan={5}>
                  <div className="mx-auto max-w-[100px]">
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      type="number"
                      control={form.control}
                      name="average2"
                      readonly
                      max={100}
                      min={0}
                    />
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex justify-center">
            <Button disabled={form.formState.isSubmitting} type="submit">
              Guardar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
