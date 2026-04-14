import { PrismaClient } from "@/app/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import NewGame from "@/components/NewGame";

import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});

export default async function Page() {

  // 🔐 VALIDAR SESIÓN
  const user = await stackServerApp.getUser();

  if (!user) {
    redirect("/");
  }

  const consoles = await prisma.console.findMany();

  return <NewGame consoles={consoles} />;
}