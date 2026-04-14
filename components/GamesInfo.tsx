import { PrismaClient } from "@/app/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import Link from "next/link";
import { deleteGame } from "@/app/actions/gameActions";
import { Prisma } from "@/app/generated/prisma";
import DeleteGameButton from "./DeleteGameButton";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});

export const dynamic = "force-dynamic";

export default async function GamesInfo({
  searchParams,
}: {
  searchParams: { search?: string; page?: string; console?: string };
}) {
  const params = await searchParams;

  const search = params?.search || "";
  const consoleFilter = params?.console || "";
  const currentPage = Number(params?.page ?? 1);
  const pageSize = 12;

  // 🔥 TRAER CONSOLAS
  const consoles = await prisma.console.findMany();

  // 🔍 FILTRO DINÁMICO
  const where: Prisma.GameWhereInput = {
    ...(search && {
      title: {
        contains: search,
        mode: "insensitive",
      },
    }),

    ...(consoleFilter && {
      console_id: Number(consoleFilter),
    }),
  };

  // 📊 TOTAL
  const totalGames = await prisma.game.count({ where });

  // 🎮 DATOS
  const games = await prisma.game.findMany({
    where,
    include: { console: true },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  const totalPages = Math.ceil(totalGames / pageSize);
  const hasGames = games.length > 0;

  return (
    <div className="relative min-h-screen">
      {/* FONDO */}
      <div className="absolute inset-0 bg-[url('/imgs/bg_game.png')] bg-cover bg-center"></div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90 backdrop-blur-sm"></div>

      {/* CONTENIDO */}
      <div className="relative z-10 p-6 text-white">
        <h1 className="text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Games Hub 🎮
        </h1>

        {/* 🔍 FILTRO + BUSCADOR */}
        <form method="GET" className="mb-6 flex flex-wrap gap-3 justify-center">
          <input
            type="text"
            name="search"
            placeholder="Buscar juego..."
            defaultValue={search}
            className="input"
          />

          <div className="flex flex-wrap gap-2 justify-center">
            {/* TODAS */}
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

        {/* ➕ CREAR */}
        <div className="mb-6 flex justify-end">
          <Link href="/games/crear">
            <button className="px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 transition">
              Crear juego
            </button>
          </Link>
        </div>

        {/* 🎮 GRID */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
            games.map((game) => (
              <div key={game.id} className="card-neon p-[14px] h-full">
                <div className="card-content h-full flex flex-col justify-between">
                  {/* IMAGEN */}
                  <img
                    src={`/imgs/${game.cover}`}
                    className="w-full h-56 object-cover rounded-t-2xl"
                  />

                  {/* CONTENIDO */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h2 className="text-lg font-semibold">{game.title}</h2>

                    <p className="text-sm text-gray-400">{game.console.name}</p>

                    <p className="text-sm mt-2 line-clamp-2 flex-grow">
                      {game.description}
                    </p>

                    <p className="mt-3 font-bold text-green-400">
                      ${game.price}
                    </p>

                    {/* BOTONES */}
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

                      <DeleteGameButton id={game.id} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 📄 PAGINACIÓN */}
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

      <input className="p-2 rounded-lg bg-gray-900/60 border border-gray-600 text-white" />
    </div>
  );
}
