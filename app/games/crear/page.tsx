import { PrismaClient } from "@/app/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import NewGame from "@/components/NewGame";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});

export default async function Page() {
  const consoles = await prisma.console.findMany();

  return <NewGame consoles={consoles} />;
}