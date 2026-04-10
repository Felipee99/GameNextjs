import { getDashboardData } from "@/app/actions/dashboardActions";
import ChartsDashboard from "./ChartsDashboard";

export default async function DashboardInfo() {
  const {
    totalGames,
    totalConsoles,
    gamesByConsole,
    salesByYear,
    avgSalesByConsole,
  } = await getDashboardData();

  return (
    <div className="relative min-h-screen">
      {/* FONDO */}
      <div className="absolute inset-0 bg-[url('/imgs/bg_game.png')] bg-cover bg-center"></div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90 backdrop-blur-sm"></div>

      <div className="relative z-10 p-6 text-white">
        <h1 className="text-4xl font-bold mb-8 text-center">Dashboard 📊</h1>

        {/* 🔥 CARDS */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <h2 className="text-xl">Total Juegos</h2>
            <p className="text-3xl font-bold text-green-400">{totalGames}</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <h2 className="text-xl">Total Consolas</h2>
            <p className="text-3xl font-bold text-blue-400">{totalConsoles}</p>
          </div>
        </div>

        {/* 📊 JUEGOS POR CONSOLA */}
        {/* 📊 JUEGOS POR CONSOLA */}
        <div className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-2xl mb-4">Juegos por consola</h2>

          {gamesByConsole.map((console) => (
            <div key={console.id} className="mb-4">
              <div className="flex justify-between mb-1">
                <span>{console.name}</span>
                <span>{console._count.games}</span>
              </div>

              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-cyan-500 h-3 rounded-full"
                  style={{
                    width: `${console._count.games * 30}px`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* 🔥 AQUÍ VAN LAS GRÁFICAS */}
        <ChartsDashboard
          salesByYear={salesByYear}
          avgSalesByConsole={avgSalesByConsole}
        />
      </div>
    </div>
  );
}
