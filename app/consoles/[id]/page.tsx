import { PrismaClient } from "@/app/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});

export default async function ConsoleDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const consoleId = Number(id);

  if (!consoleId) {
    return <div className="p-6 text-red-500">ID inválido</div>;
  }

  const consoleData = await prisma.console.findUnique({
    where: { id: consoleId },
    include: { games: true }, // 🔥 por si quieres mostrar juegos
  });

  if (!consoleData) {
    return <div className="p-6 text-white">Consola no encontrada</div>;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/imgs/bg_home.png')" }}
    >
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-black/90 backdrop-blur-sm"></div>

      {/* CARD PRINCIPAL */}
      <div className="relative z-10 max-w-5xl w-full mx-4 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="grid md:grid-cols-2">
          
          {/* IMAGEN */}
          <div className="relative group">
            <img
              src={`/imgs/consoles/${consoleData.image || "default.png"}`}
              alt={consoleData.name}
              className="w-full h-80 md:h-full object-cover transform group-hover:scale-105 transition duration-500"
            />

            {/* HOVER */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <span className="text-white text-lg font-semibold tracking-widest">
                POWER ON ⚡
              </span>
            </div>
          </div>

          {/* INFO */}
          <div className="p-6 flex flex-col justify-between text-white">
            <div>
              {/* TITULO */}
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                {consoleData.name}
              </h1>

              {/* ID */}
              <p className="text-sm text-gray-400 mt-1">
                ID: {consoleData.id}
              </p>

              {/* INFO EXTRA (si tienes campos luego los metes aquí) */}
              <span className="inline-block mt-3 px-3 py-1 text-xs bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30">
                Consola Gaming
              </span>

              {/* DESCRIPCIÓN MOCK (puedes cambiarla luego) */}
              <p className="text-sm text-gray-200 mt-4 leading-relaxed">
                Esta consola ofrece una experiencia de juego de alto rendimiento,
                diseñada para gamers que buscan potencia, velocidad y calidad gráfica.
              </p>
            </div>

            {/* BOTONES */}
            <div className="mt-6">
              <div className="flex gap-3">
                
                {/* EDITAR */}
                <a
                  href={`/consoles/editar/${consoleData.id}`}
                  className="flex-1 text-center py-2 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 transition transform hover:scale-105 active:scale-95 shadow-md"
                >
                  Editar
                </a>

                {/* VOLVER */}
                <a
                  href="/consoles"
                  className="flex-1 text-center py-2 rounded-lg bg-gray-500/20 hover:bg-gray-500/40 text-gray-300 transition transform hover:scale-105 active:scale-95 shadow-md"
                >
                  Volver
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 GLOW DECORATIVO */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-cyan-500/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full"></div>
    </div>
  );
}