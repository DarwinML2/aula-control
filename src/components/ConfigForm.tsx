"use client";
import { updateCondfig } from "@/actions/school";
import { configSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { School } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CustomFormField, FormFieldType } from "./CustomFormField";
import { Button } from "./ui/button";
import { Form } from "./ui/form";
export default function ConfigForm({ config }: { config: School }) {
  const form = useForm<z.infer<typeof configSchema>>({
    defaultValues: { year: config.year, name: config.name, gradeMax: config.gradeMax },
    resolver: zodResolver(configSchema),
  });
  async function onSubmit(values: z.infer<typeof configSchema>) {
    const result = await updateCondfig(config.id, values);
    console.log(result);
    if (!result) toast.error("Error al guardar la configuración");

    toast.success("Configuración guardada");
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            label="Año"
            name="year"
            control={form.control}
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            label="Nombre del colegio"
            name="name"
            control={form.control}
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            type="number"
            label="Maximo de estudiantes por grado"
            name="gradeMax"
            control={form.control}
          />
          <Button type="submit">Guardar</Button>
        </form>
      </Form>
    </div>
  );
}
