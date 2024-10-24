"use client";
import { editAttendanceToStudent, getAttendanceOptions } from "@/actions/attendance";
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
import { Attendance, AttendanceOption, Student } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
export function EditAttendanceFormModal({
  attendance,
  student,
  courseId,
}: {
  attendance: Attendance;
  student: Student;
  courseId: number;
}) {
  const router = useRouter();
  const [attendanceOptions, setAttendanceOptions] = useState<AttendanceOption[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof attendanceSchema>>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      attendanceOption: attendance.attendanceOptionId,
    },
  });
  useEffect(() => {
    getAttendanceOptions().then((items) => setAttendanceOptions(items));
  }, []);
  async function onSubmit(values: z.infer<typeof attendanceSchema>) {
    const result = await editAttendanceToStudent({
      attendanceId: attendance.id,
      attendanceOptionId: values.attendanceOption,
      courseId,
    });
    if (result) {
      toast.success("Asistencia actualiada!");
      setIsOpen(false);
      router.refresh();
    } else {
      toast.error("Error al actualizar la asistencia!");
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
                <Button type="submit">Editar</Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
