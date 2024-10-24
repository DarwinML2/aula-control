"use client";

import { getUser, signInUser } from "@/actions/users";
import { CustomFormField, FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { RoleEnum } from "@/enums";
import { signInSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Form } from "./ui/form";

export function LogInFormModal() {
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof signInSchema>) {
    const result = await signInUser(values.email, values.password);
    if (result) {
      const user = await getUser({ username: values.email });
      if (!user) return;
      if (user.roleId === RoleEnum.ADMIN) {
        router.push("/admin");
      } else if (user.roleId === RoleEnum.TEACHER) {
        router.push("/teachers");
      } else if (user.roleId === RoleEnum.PARENT) {
        router.push("/parents");
      }
    } else {
      toast.error("Error al iniciar sesion");
    }
  }
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Log in</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                label="Correo electronico"
                // type="email"
                name="email"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                type="password"
                name="password"
                label="Contraseña"
              />

              <div className="flex justify-center">
                <Button type="submit">Sign in</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
