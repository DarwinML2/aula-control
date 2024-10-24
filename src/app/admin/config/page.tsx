import { getConfig } from "@/actions/school";
import ConfigForm from "@/components/ConfigForm";

export default async function page() {
  const config = await getConfig();
  if (config === null) {
    return <div>No existe configuración</div>;
  }
  return (
    <div className="mx-auto max-w-xl">
      <div className="container mx-auto mt-4">
        <h1 className="text-3xl font-bold">Configuración</h1>
      </div>
      <section className="container mx-auto mt-10">
        <ConfigForm config={config} />
      </section>
    </div>
  );
}
