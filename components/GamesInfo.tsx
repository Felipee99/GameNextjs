import { PrismaClient } from "@/app/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import Link from "next/link";
import { deleteGame } from "@/app/actions/gameActions";
import SearchBar from "./SearchBar";
import { Prisma } from "@/app/generated/prisma";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});

export const dynamic = "force-dynamic";

export default async function GamesInfo({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;

  const search = params?.search || "";
  const currentPage = Number(params?.page ?? 1);
  const pageSize = 12;

  // 🔍 FILTRO
  const where: Prisma.GameWhereInput = search
    ? {
        title: {
          contains: search,
          mode: "insensitive",
        },
      }
    : {};

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
          Games Hub 🍊
        </h1>

        {/* 🔍 BUSCADOR */}
        <SearchBar />

        {/* ➕ CREAR */}
        <div className="mb-6 flex justify-end">
          <Link href="/games/crear">
            <button className="relative group px-6 py-3 rounded-xl overflow-hidden bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold tracking-wide shadow-lg transition duration-300 hover:scale-105 hover:shadow-green-500/40 active:scale-95">
              <span className="absolute inset-0 bg-gradient-to-r from-green-300 to-emerald-400 opacity-0 group-hover:opacity-30 blur-xl transition duration-500"></span>
              <span className="absolute inset-0 rounded-xl border border-white/10 group-hover:border-green-300/40 transition"></span>
              <span className="relative z-10 flex items-center gap-2">
                Crear juego
              </span>
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
              <div key={game.id} className="card-neon p-[14px] h-full group">
                <div className="card-content h-full flex flex-col justify-between relative transition duration-300 group-hover:scale-105 group-hover:z-10 shadow-lg">
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

                      <form
                        action={async () => {
                          "use server";
                          await deleteGame(game.id);
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

        {/* 📄 PAGINACIÓN */}
        {totalPages > 0 && (
          <div className="flex justify-center mt-8 gap-2 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => (
              <Link
                key={i}
                href={`/games?search=${search}&page=${i + 1}`}
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
