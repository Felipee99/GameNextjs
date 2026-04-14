"use server";

import { PrismaClient } from "@/app/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";

// conexión a la base de datos usando Prisma + Neon
const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});

// función principal que arma todos los datos del dashboard
export async function getDashboardData() {

  // contar total de juegos
  const totalGames = await prisma.game.count();

  // contar total de consolas
  const totalConsoles = await prisma.console.count();

  // traer consolas con la cantidad de juegos que tiene cada una
  const gamesByConsole = await prisma.console.findMany({
    include: {
      _count: {
        select: { games: true }, // cuenta los juegos relacionados
      },
    },
  });

  // traer solo los datos necesarios de los juegos
  const games = await prisma.game.findMany({
    select: {
      releasedate: true,
      price: true,
      console_id: true,
    },
  });

  // objeto para acumular ventas por año
  const salesByYearMap: Record<number, number> = {};

  // recorrer todos los juegos
  games.forEach((game) => {

    // sacar el año de la fecha
    const year = new Date(game.releasedate).getFullYear();

    // si el año no existe en el objeto, lo inicializamos
    if (!salesByYearMap[year]) {
      salesByYearMap[year] = 0;
    }

    // sumamos el precio del juego a ese año
    salesByYearMap[year] += game.price;
  });

  // convertir el objeto en array para usarlo en gráficas
  const salesByYear = Object.entries(salesByYearMap).map(
    ([year, total]) => ({
      year: Number(year),
      total,
    })
  );

  // objeto para calcular promedio por consola
  const avgMap: Record<number, { total: number; count: number }> = {};

  // recorrer juegos otra vez
  games.forEach((game) => {

    // si no existe la consola en el objeto, la creamos
    if (!avgMap[game.console_id]) {
      avgMap[game.console_id] = { total: 0, count: 0 };
    }

    // sumamos precio
    avgMap[game.console_id].total += game.price;

    // contamos cuántos juegos tiene
    avgMap[game.console_id].count += 1;
  });

  // traer consolas para obtener el nombre
  const consoles = await prisma.console.findMany();

  // construir el promedio final por consola
  const avgSalesByConsole = Object.entries(avgMap).map(
    ([consoleId, data]) => {

      // buscar el nombre de la consola
      const consoleData = consoles.find(
        (c) => c.id === Number(consoleId)
      );

      return {
        console_id: Number(consoleId),
        console_name: consoleData?.name || "Unknown",
        avg: data.total / data.count, // promedio = total / cantidad
      };
    }
  );

  // devolver todo listo para el dashboard
  return {
    totalGames,
    totalConsoles,
    gamesByConsole,
    salesByYear,
    avgSalesByConsole,
  };
}