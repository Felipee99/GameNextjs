import { PrismaClient } from "@/app/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { updateGame } from "@/app/actions/gameActions";
import Link from "next/link";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});

export default async function EditGame({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gameId = Number(id);

  if (!gameId) {
    return <div className="text-white">ID inválido</div>;
  }

  const game = await prisma.game.findUnique({
    where: { id: gameId },
  });

  if (!game) {
    return <div className="text-white">Juego no encontrado</div>;
  }

  const consoles = await prisma.console.findMany();

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6">
      {/* FONDO */}
      <div className="absolute inset-0 bg-[url('/imgs/bg_game.png')] bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      {/* BOTÓN VOLVER */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/games"
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-sm text-white"
        >
          ← Volver
        </Link>
      </div>

      {/* FORM */}
      <form
        action={async (formData) => {
          "use server";
          await updateGame(game.id, formData);
        }}
        className="relative z-10 w-full max-w-2xl bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col gap-5 text-white"
      >
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Editar Juego
        </h2>
        {/* GRID */}
        <div className="grid grid-cols-2 gap-4">
          {/* TITULO */}
          <input
            name="title"
            defaultValue={game.title}
            placeholder="Título"
            className="input"
          />
          {/* DEVELOPER */}
          <input
            name="developer"
            defaultValue={game.developer}
            placeholder="Desarrollador"
            className="input"
          />
          {/* FECHA */}
          <input
            type="date"
            name="releasedate"
            defaultValue={game.releasedate.toISOString().split("T")[0]}
            className="input"
          />
          {/* PRECIO */}
          <input
            name="price"
            type="number"
            defaultValue={game.price}
            placeholder="Precio"
            className="input"
          />
          {/* GENERO */}
          <input
            name="genre"
            defaultValue={game.genre}
            placeholder="Género"
            className="input"
          />
          {/* CONSOLA */}
          <select
            name="console_id"
            defaultValue={game.console_id}
            className="input"
          >
            {consoles.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {/* IMAGEN */}
          <div className="col-span-2 flex flex-col gap-2">
            <label className="text-sm text-gray-300">Imagen actual</label>

            <img
              src={`/imgs/${game.cover}`}
              className="h-40 object-cover rounded-lg border border-gray-600"
            />

            <label className="text-sm text-gray-400 mt-2">
              Cambiar imagen (opcional)
            </label>

            <input
              type="file"
              name="cover"
              accept="image/*"
              className="input"
            />
          </div>{" "}
          {/* 👈 CIERRA IMAGEN */}
        </div>{" "}
        {/* 👈🔥 CIERRA EL GRID (ESTE FALTABA) */}
        {/* DESCRIPCIÓN */}
        <textarea
          name="description"
          defaultValue={game.description}
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
            href="/games"
            className="flex-1 text-center py-3 rounded-xl bg-gray-500/20 hover:bg-gray-500/40 transition"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
