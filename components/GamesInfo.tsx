import { PrismaClient } from "@/app/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import Link from "next/link";
import { Prisma } from "@/app/generated/prisma";
import DeleteGameButton from "./DeleteGameButton";

// conexión a la base de datos usando Prisma + Neon
const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});

// fuerza render dinámico (no cachea la página)
export const dynamic = "force-dynamic";

export default async function GamesInfo({
  searchParams,
}: {
  searchParams: { search?: string; page?: string; console?: string };
}) {
  // parámetros de la URL (search, page, console)
  const params = await searchParams;

  // búsqueda por nombre del juego
  const search = params?.search || "";

  // filtro de consola seleccionada
  const consoleFilter = params?.console || "";

  // página actual para paginación
  const currentPage = Number(params?.page ?? 1);

  // cantidad de juegos por página
  const pageSize = 12;

  // obtener todas las consolas para el filtro visual
  const consoles = await prisma.console.findMany();

  // construcción dinámica del WHERE (filtros combinados)
  const where: Prisma.GameWhereInput = {
    // si hay búsqueda, filtra por título
    ...(search && {
      title: {
        contains: search,
        mode: "insensitive",
      },
    }),

    // si hay consola seleccionada, filtra por console_id
    ...(consoleFilter && {
      console_id: Number(consoleFilter),
    }),
  };

  // contar total de juegos con filtros aplicados
  const totalGames = await prisma.game.count({ where });

  // traer juegos paginados con relación de consola incluida
  const games = await prisma.game.findMany({
    where,
    include: { console: true },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  // total de páginas para paginación
  const totalPages = Math.ceil(totalGames / pageSize);

  // saber si hay juegos o está vacío
  const hasGames = games.length > 0;

  return (
    <div className="relative min-h-screen">

      {/* fondo de la página */}
      <div className="absolute inset-0 bg-[url('/imgs/bg_game.png')] bg-cover bg-center"></div>

      {/* overlay oscuro para contraste */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90 backdrop-blur-sm"></div>

      {/* contenido principal */}
      <div className="relative z-10 p-6 text-white">

        {/* título */}
        <h1 className="text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Games Hub 🎮
        </h1>

        {/* filtro + búsqueda */}
        <form method="GET" className="mb-6 flex flex-wrap gap-3 justify-center">

          {/* input de búsqueda */}
          <input
            type="text"
            name="search"
            placeholder="Buscar juego..."
            defaultValue={search}
            className="input"
          />

          {/* filtros de consola tipo "burbujas" */}
          <div className="flex flex-wrap gap-2 justify-center">

            {/* opción todas las consolas */}
            <Link
              href={`/games?search=${search}`}
              className={`px-3 py-1 rounded-full text-sm transition border ${
                !consoleFilter
                  ? "bg-cyan-500 text-white border-cyan-400"
                  : "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700"
              }`}
            >
              Todas
            </Link>

            {/* lista de consolas */}
            {consoles.map((c) => (
              <Link
                key={c.id}
                href={`/games?search=${search}&console=${c.id}`}
                className={`px-3 py-1 rounded-full text-sm transition border ${
                  Number(consoleFilter) === c.id
                    ? "bg-cyan-500 text-white border-cyan-400"
                    : "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </form>

        {/* botón crear juego */}
        <div className="mb-6 flex justify-end">
          <Link href="/games/crear">
            <button className="px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 transition">
              Crear juego
            </button>
          </Link>
        </div>

        {/* grid de juegos */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

          {/* si no hay juegos */}
          {!hasGames ? (
            <div className="col-span-full text-center text-gray-400 mt-10">
              <p className="text-xl">No se encontraron juegos 😢</p>
              <p className="text-sm mt-2">
                {search
                  ? `No hay resultados para "${search}"`
                  : "Aún no hay juegos registrados"}
              </p>
            </div>
          ) : (
            // render de juegos
            games.map((game) => (
              <div key={game.id} className="card-neon p-[14px] h-full">

                <div className="card-content h-full flex flex-col justify-between">

                  {/* imagen del juego */}
                  <img
                    src={`/imgs/${game.cover}`}
                    className="w-full h-56 object-cover rounded-t-2xl"
                  />

                  {/* info del juego */}
                  <div className="p-4 flex flex-col flex-grow">

                    <h2 className="text-lg font-semibold">{game.title}</h2>

                    <p className="text-sm text-gray-400">
                      {game.console.name}
                    </p>

                    <p className="text-sm mt-2 line-clamp-2 flex-grow">
                      {game.description}
                    </p>

                    <p className="mt-3 font-bold text-green-400">
                      ${game.price}
                    </p>

                    {/* botones de acciones */}
                    <div className="flex gap-2 mt-4">

                      <Link
                        href={`/games/${game.id}`}
                        className="flex-1 text-center text-xs bg-cyan-500/20 py-1 rounded-lg hover:bg-cyan-500/40 transition"
                      >
                        Ver
                      </Link>

                      <Link
                        href={`/games/editar/${game.id}`}
                        className="flex-1 text-center text-xs bg-yellow-500/20 py-1 rounded-lg hover:bg-yellow-500/40 transition"
                      >
                        Editar
                      </Link>

                      {/* botón eliminar con server action */}
                      <DeleteGameButton id={game.id} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* paginación */}
        {totalPages > 0 && (
          <div className="flex justify-center mt-8 gap-2 flex-wrap">

            {Array.from({ length: totalPages }, (_, i) => (
              <Link
                key={i}
                href={`/games?search=${search}&console=${consoleFilter}&page=${i + 1}`}
                className={`px-3 py-1 rounded-lg transition ${
                  currentPage === i + 1
                    ? "bg-cyan-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {i + 1}
              </Link>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}