import { PrismaClient } from "@/app/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import Link from "next/link";
import EditGameForm from "@/components/EditGameForm";


import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";

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

  // VALIDAR SESIÓN
  const user = await stackServerApp.getUser();

  if (!user) {
    redirect("/");
  }

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
      <EditGameForm game={game} consoles={consoles} />
    </div>
  );
}