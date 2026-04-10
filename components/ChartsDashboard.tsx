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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface DashboardProps {
  salesByYear: { year: number; total: number }[];
  avgSalesByConsole: {
    console_id: number;
    console_name: string; // 🔥 nombre real
    avg: number;
  }[];
}

export default function ChartsDashboard({
  salesByYear,
  avgSalesByConsole,
}: DashboardProps) {
  // 🎨 CONFIG GLOBAL (VISIBLE EN FONDO OSCURO)
  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#fff",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#fff" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        ticks: { color: "#fff" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  // 📊 VENTAS POR AÑO
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

  // 📈 PROMEDIO POR CONSOLA (YA CON NOMBRE 🔥)
  const dataAvg = {
    labels: avgSalesByConsole.map(
      (c) => c.console_name // 🔥 aquí está la magia
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
      
      {/* 📊 VENTAS */}
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl mb-4 text-white">Ventas por año</h2>
        <Bar data={dataSales} options={options} />
      </div>

      {/* 📈 PROMEDIO */}
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl mb-4 text-white">Promedio por consola</h2>
        <Bar data={dataAvg} options={options} />
      </div>
    </div>
  );
}