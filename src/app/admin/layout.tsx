import { auth } from "@/auth";
import { LogOutButton } from "@/components/LogOutButton";
import { Button } from "@/components/ui/button";
import { RoleEnum } from "@/enums";
import Link from "next/link";
import { redirect } from "next/navigation";
const asideMenu = [
  {
    label: "Inicio",
    link: "/admin",
  },
  {
    label: "Padres",
    link: "/admin/parents",
  },
  {
    label: "Profesores",
    link: "/admin/teachers",
  },
  {
    label: "Grados",
    link: "/admin/grades",
  },
  {
    label: "Materias",
    link: "/admin/subjects",
  },
  {
    label: "Clases",
    link: "/admin/classes",
  },
  {
    label: "Configuración",
    link: "/admin/config",
  },
];
export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session || session.user.roleId !== RoleEnum.ADMIN) {
    redirect("/");
  }
  return (
    <div className="flex min-h-screen">
      <aside className="w-full max-w-[200px] bg-admin text-center">
        <h3 className="my-3 text-4xl font-semibold text-admin-foreground">Admin Panel</h3>
        <div className="mx-4 flex flex-col gap-4">
          {asideMenu.map((item) => (
            <Button
              asChild
              key={item.label}
              variant="outline"
              className="bg-admin text-admin-foreground"
            >
              <Link href={item.link}>{item.label}</Link>
            </Button>
          ))}
          <LogOutButton />
        </div>
      </aside>
      <div className="grow px-4">
        <div className="container py-4">{children}</div>
      </div>
    </div>
  );
}
