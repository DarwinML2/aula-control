"use client";

import { addReportToStudent, deleteReport, getReportsByStudent } from "@/actions/students";
import { CustomFormField, FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { reportSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma, Report } from "@prisma/client";
import { format } from "date-fns";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "./ui/card";

export default function StudentsReport({
  student,
}: {
  student: Prisma.StudentGetPayload<{
    include: { grade: true; Report: true; Attendance: true; Note: true };
  }>;
}) {
  const [reports, setReports] = useState<Report[]>([]);
  useEffect(() => {
    getReportsByStudent(student.id).then((reports) => {
      setReports(reports);
    });
  }, [student]);
  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      description: "",
    },
  });
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof reportSchema>) {
    const result = await addReportToStudent({
      studentId: student.id,
      description: values.description,
    });
    if (result) {
      setReports((prev) => [result, ...prev]);
      toast.success("Reporte agregado!");
      router.refresh();
      form.reset();
    } else {
      toast.error("Error al agregar reporte!");
    }
  }
  async function handleDelete(id: number) {
    const result = await deleteReport(id);
    if (result) {
      setReports((prev) => prev.filter((report) => report.id !== id));
      toast.success("Reporte borrado!");
      router.refresh();
    } else {
      toast.error("Error al borrar reporte!");
    }
  }
  return (
    <div>
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex gap-2">
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
      {reports.length > 0 && (
        <div className="my-8 space-y-4">
          <h2 className="text-2xl font-semibold">
            Reportes anteriores del estudiante {student.name} {student.lastname}
          </h2>
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <CardDescription>{format(report.date, "PPP")}</CardDescription>
              </CardHeader>
              <CardContent>
                <h3>{report.description}</h3>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => {
                    handleDelete(report.id);
                  }}
                  size="sm"
                  variant="destructive"
                >
                  Borrar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
