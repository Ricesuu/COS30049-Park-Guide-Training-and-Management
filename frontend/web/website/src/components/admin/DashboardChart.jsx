import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  TimeScale,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  TimeScale
);

const DashboardChart = () => {
  const barData = {
    labels: ["Temperature", "Humidity"],
    datasets: [
      {
        label: "Data from Sensors",
        data: [22, 60],
        backgroundColor: ["#4CAF50", "#8BC34A", "#A5D6A7", "#81C784", "#66BB6A"],
        borderRadius: 12,
      },
    ],
  };

  const pieData = {
    labels: ["Pending", "Approved", "Rejected"],
    datasets: [
      {
        label: "License Approvals",
        data: [5, 15, 2],
        backgroundColor: ["#FFB74D", "#4CAF50", "#E57373"],
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Park Guide Registrations",
        data: [20, 25, 30, 28, 35],
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-green-800">Overview</h2>
        <Bar data={barData} options={options} />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-green-800">License Status</h2>
        <Pie data={pieData} options={options} />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md md:col-span-2">
        <h2 className="text-lg font-semibold mb-4 text-green-800">Park Guide Registrations (Monthly)</h2>
        <Line data={lineData} options={options} />
      </div>
    </div>
  );
};

export default DashboardChart;
