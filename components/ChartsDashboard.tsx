"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// registrar componentes necesarios de Chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// tipos de datos que recibe el componente
interface DashboardProps {
  salesByYear: { year: number; total: number }[];
  avgSalesByConsole: {
    console_id: number;
    console_name: string;
    avg: number;
  }[];
}

export default function ChartsDashboard({
  salesByYear,
  avgSalesByConsole,
}: DashboardProps) {

  // configuración global del gráfico (colores para fondo oscuro)
  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#fff", // texto de la leyenda en blanco
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#fff" }, // texto eje X
        grid: { color: "rgba(255,255,255,0.1)" }, // líneas suaves
      },
      y: {
        ticks: { color: "#fff" }, // texto eje Y
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  // datos del gráfico: ventas por año
  const dataSales = {
    labels: salesByYear.map((item) => item.year),
    datasets: [
      {
        label: "Ventas por año",
        data: salesByYear.map((item) => item.total),
        backgroundColor: "rgba(0, 255, 255, 0.6)",
        borderColor: "rgba(0, 255, 255, 1)",
        borderWidth: 2,
      },
    ],
  };

  // datos del gráfico: promedio de ventas por consola
  const dataAvg = {
    labels: avgSalesByConsole.map(
      (c) => c.console_name // nombre de la consola en el eje X
    ),
    datasets: [
      {
        label: "Promedio ventas",
        data: avgSalesByConsole.map((c) => c.avg),
        backgroundColor: "rgba(255, 0, 255, 0.6)",
        borderColor: "rgba(255, 0, 255, 1)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-10">

      {/* gráfico ventas por año */}
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl mb-4 text-white">Ventas por año</h2>
        <Bar data={dataSales} options={options} />
      </div>

      {/* gráfico promedio por consola */}
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl mb-4 text-white">Promedio por consola</h2>
        <Bar data={dataAvg} options={options} />
      </div>

    </div>
  );
}