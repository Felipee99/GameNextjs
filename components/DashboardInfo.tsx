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

  // 🔥 sacar el máximo para hacer barras en %
  const maxGames = Math.max(
    ...gamesByConsole.map((c) => c._count.games),
    1
  );

  return (
    <div className="relative min-h-screen">
      {/* FONDO */}
      <div className="absolute inset-0 bg-[url('/imgs/bg_game.png')] bg-cover bg-center"></div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90 backdrop-blur-sm"></div>

      <div className="relative z-10 px-4 py-6 sm:px-6 lg:px-10 text-white">
        
        {/* 🔥 TÍTULO RESPONSIVE */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center">
          Dashboard 📊
        </h1>

        {/* 🔥 CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          
          <div className="bg-gray-800 p-4 sm:p-6 rounded-xl text-center shadow-lg">
            <h2 className="text-base sm:text-xl">Total Juegos</h2>
            <p className="text-2xl sm:text-3xl font-bold text-green-400">
              {totalGames}
            </p>
          </div>

          <div className="bg-gray-800 p-4 sm:p-6 rounded-xl text-center shadow-lg">
            <h2 className="text-base sm:text-xl">Total Consolas</h2>
            <p className="text-2xl sm:text-3xl font-bold text-blue-400">
              {totalConsoles}
            </p>
          </div>
        </div>

        {/* 📊 JUEGOS POR CONSOLA */}
        <div className="bg-gray-900 p-4 sm:p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-lg sm:text-2xl mb-4">
            Juegos por consola
          </h2>

          {gamesByConsole.map((console) => {
            const percentage =
              (console._count.games / maxGames) * 100;

            return (
              <div key={console.id} className="mb-4">
                
                <div className="flex justify-between text-sm sm:text-base mb-1">
                  <span className="truncate">{console.name}</span>
                  <span>{console._count.games}</span>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3">
                  <div
                    className="bg-cyan-500 h-2 sm:h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                    }}
                  ></div>
                </div>

              </div>
            );
          })}
        </div>

        {/* 📊 GRÁFICAS */}
        <div className="w-full overflow-x-auto">
          <ChartsDashboard
            salesByYear={salesByYear}
            avgSalesByConsole={avgSalesByConsole}
          />
        </div>

      </div>
    </div>
  );
}