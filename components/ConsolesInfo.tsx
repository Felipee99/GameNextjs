import { PrismaClient } from "@/app/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import Link from "next/link";
import { Prisma } from "@/app/generated/prisma";
import { deleteConsole } from "@/app/actions/consoleActions";
import ImageWithFallback from "./ImageWithFallback";

// conexión a la base de datos
const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});

// fuerza a Next.js a no cachear la página
export const dynamic = "force-dynamic";

export default async function ConsolesInfo({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {

  // obtener parámetros de la URL (búsqueda y paginación)
  const params = await searchParams;

  const search = params?.search || "";
  const currentPage = Number(params?.page ?? 1);
  const pageSize = 12;

  // filtro dinámico por nombre de consola
  const where: Prisma.ConsoleWhereInput = search
    ? {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }
    : {};

  // contar total de consolas según filtro
  const totalConsoles = await prisma.console.count({ where });

  // obtener consolas con paginación
  const consoles = await prisma.console.findMany({
    where,
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  const totalPages = Math.ceil(totalConsoles / pageSize);
  const hasConsoles = consoles.length > 0;

  return (
    <div className="relative min-h-screen">

      {/* fondo */}
      <div className="absolute inset-0 bg-[url('/imgs/bg_game.png')] bg-cover bg-center"></div>

      {/* overlay oscuro */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90 backdrop-blur-sm"></div>

      <div className="relative z-10 p-6 text-white">

        {/* título */}
        <h1 className="text-4xl font-bold text-center mb-6">
          Consolas 🎮
        </h1>

        {/* botón crear consola */}
        <div className="mb-6 flex justify-end">
          <Link href="/consoles/crear">
            <button className="bg-green-500 px-4 py-2 rounded-lg">
              Crear consola
            </button>
          </Link>
        </div>

        {/* grid de consolas */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

          {/* si no hay consolas */}
          {!hasConsoles ? (
            <p>No hay consolas 😢</p>
          ) : (
            consoles.map((console) => (
              <div key={console.id} className="card-neon p-[14px] h-full group">

                <div className="card-content h-full flex flex-col justify-between relative transition duration-300 group-hover:scale-105 group-hover:z-10 shadow-lg">

                  {/* imagen con fallback */}
                  <ImageWithFallback
                    src={
                      console.image
                        ? `/imgs/${console.image}`
                        : "/imgs/default.png"
                    }
                    fallbackSrc="/imgs/default.png"
                    className="w-full h-56 object-cover rounded-t-2xl"
                  />

                  <div className="p-4 flex flex-col flex-grow">

                    {/* nombre consola */}
                    <h2 className="text-lg font-semibold">
                      {console.name}
                    </h2>

                    {/* id consola */}
                    <p className="text-sm text-gray-400 mt-1">
                      ID: {console.id}
                    </p>

                    {/* empuja botones abajo */}
                    <div className="flex-grow"></div>

                    {/* botones acciones */}
                    <div className="flex gap-2 mt-4">

                      {/* ver consola */}
                      <Link
                        href={`/consoles/${console.id}`}
                        className="flex-1 text-center text-xs bg-cyan-500/20 py-1 rounded-lg hover:bg-cyan-500/40 transition"
                      >
                        Ver
                      </Link>

                      {/* editar consola */}
                      <Link
                        href={`/consoles/editar/${console.id}`}
                        className="flex-1 text-center text-xs bg-yellow-500/20 py-1 rounded-lg hover:bg-yellow-500/40 transition"
                      >
                        Editar
                      </Link>

                      {/* eliminar consola */}
                      <form
                        action={async () => {
                          "use server";
                          await deleteConsole(console.id);
                        }}
                        className="flex-1"
                      >
                        <button className="w-full text-xs bg-red-500/20 py-1 rounded-lg hover:bg-red-500/40 transition">
                          Eliminar
                        </button>
                      </form>

                    </div>

                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}