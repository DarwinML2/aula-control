"use client";
import { addAttendanceToStudent, getAttendanceOptions } from "@/actions/attendance";
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
import { attendanceSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { AttendanceOption, Student } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
export function AddAttendanceFormModal({
  student,
  courseId,
  refreshStudents,
}: {
  student: Student;
  courseId: number;
  refreshStudents: (gradeId: number) => void;
}) {
  const router = useRouter();
  const [attendanceOptions, setAttendanceOptions] = useState<AttendanceOption[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof attendanceSchema>>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      attendanceOption: "",
    },
  });
  useEffect(() => {
    getAttendanceOptions().then((items) => setAttendanceOptions(items));
  }, []);
  async function onSubmit(values: z.infer<typeof attendanceSchema>) {
    const result = await addAttendanceToStudent({
      studentId: student.id,
      attendanceOptionId: values.attendanceOption,
      courseId,
    });
    if (result) {
      toast.success("Asistencia agregada!");
      router.refresh();
      refreshStudents(student.gradeId);
      setIsOpen(false);
    } else {
      toast.error("Error al agregar la asistencia!");
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Asistencia</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Asistencia del(a) estudiante {student.name} {student.lastname}
          </DialogTitle>
          <DialogDescription></DialogDescription>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                label="Asistencia"
                control={form.control}
                name="attendanceOption"
              >
                {attendanceOptions.map((attendanceOption) => (
                  <SelectItem key={attendanceOption.name} value={attendanceOption.name}>
                    {attendanceOption.description}
                  </SelectItem>
                ))}
              </CustomFormField>
              <div className="flex justify-center">
                <Button disabled={form.formState.isSubmitting} type="submit">
                  Agregar
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
