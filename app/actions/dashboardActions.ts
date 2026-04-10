"use server";

import { PrismaClient } from "@/app/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});

// 📊 Datos del dashboard
export async function getDashboardData() {
  const totalGames = await prisma.game.count();
  const totalConsoles = await prisma.console.count();

  const gamesByConsole = await prisma.console.findMany({
    include: {
      _count: {
        select: { games: true },
      },
    },
  });

  // 🔥 TRAER JUEGOS REALES
  const games = await prisma.game.findMany({
    select: {
      releasedate: true,
      price: true,
      console_id: true,
    },
  });

  // 📊 AGRUPAR POR AÑO
  const salesByYearMap: Record<number, number> = {};

  games.forEach((game) => {
    const year = new Date(game.releasedate).getFullYear();

    if (!salesByYearMap[year]) {
      salesByYearMap[year] = 0;
    }

    salesByYearMap[year] += game.price;
  });

  const salesByYear = Object.entries(salesByYearMap).map(
    ([year, total]) => ({
      year: Number(year),
      total,
    })
  );

  // 📈 PROMEDIO POR CONSOLA
  const avgMap: Record<number, { total: number; count: number }> = {};

  games.forEach((game) => {
    if (!avgMap[game.console_id]) {
      avgMap[game.console_id] = { total: 0, count: 0 };
    }

    avgMap[game.console_id].total += game.price;
    avgMap[game.console_id].count += 1;
  });

  const consoles = await prisma.console.findMany();

  const avgSalesByConsole = Object.entries(avgMap).map(
    ([consoleId, data]) => {
      const consoleData = consoles.find(
        (c) => c.id === Number(consoleId)
      );

      return {
        console_id: Number(consoleId),
        console_name: consoleData?.name || "Unknown",
        avg: data.total / data.count,
      };
    }
  );

  return {
    totalGames,
    totalConsoles,
    gamesByConsole,
    salesByYear,
    avgSalesByConsole,
  };
}