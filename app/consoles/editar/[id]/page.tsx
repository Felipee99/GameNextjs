import { PrismaClient } from "@/app/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { updateConsole } from "@/app/actions/consoleActions"; // 👈 tu acción server para actualizar consolas
import Link from "next/link";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});

export default async function EditConsole({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const consoleId = Number(id);

  if (!consoleId) {
    return <div className="text-white">ID inválido</div>;
  }

  const consoleData = await prisma.console.findUnique({
    where: { id: consoleId },
  });

  if (!consoleData) {
    return <div className="text-white">Consola no encontrada</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6">
      {/* FONDO */}
      <div className="absolute inset-0 bg-[url('/imgs/bg_game.png')] bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      {/* BOTÓN VOLVER */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/consoles"
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-sm text-white"
        >
          ← Volver
        </Link>
      </div>

      {/* FORM */}
      <form
        action={async (formData) => {
          "use server";
          await updateConsole(consoleData.id, formData);
        }}
        className="relative z-10 w-full max-w-2xl bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col gap-5 text-white"
      >
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Editar Consola
        </h2>

        {/* GRID */}
        <div className="grid grid-cols-2 gap-4">
          {/* NOMBRE */}
          <input
            name="name"
            defaultValue={consoleData.name}
            placeholder="Nombre de la consola"
            className="input"
          />

          {/* FABRICANTE */}
          <input
            name="manufacturer"
            defaultValue={consoleData.manufacturer}
            placeholder="Fabricante"
            className="input"
          />

          {/* FECHA DE LANZAMIENTO */}
          <input
            type="date"
            name="releasedate"
            defaultValue={consoleData.releasedate.toISOString().split("T")[0]}
            className="input"
          />

          {/* IMAGEN */}
          <div className="col-span-2 flex flex-col gap-2">
            <label className="text-sm text-gray-300">Imagen actual</label>

            <img
              src={`/imgs/consoles/${consoleData.image || "default.png"}`}
              className="h-40 object-cover rounded-lg border border-gray-600"
            />

            <label className="text-sm text-gray-400 mt-2">
              Cambiar imagen (opcional)
            </label>

            <input
              type="file"
              name="image"
              accept="image/*"
              className="input"
            />
          </div>
        </div>

        {/* DESCRIPCIÓN */}
        <textarea
          name="description"
          defaultValue={consoleData.description}
          placeholder="Descripción"
          className="input min-h-[100px]"
        />

        {/* BOTONES */}
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="flex-1 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 transition font-semibold tracking-wide hover:scale-105 active:scale-95"
          >
            Guardar cambios
          </button>

          <Link
            href="/consoles"
            className="flex-1 text-center py-3 rounded-xl bg-gray-500/20 hover:bg-gray-500/40 transition"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}