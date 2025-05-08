import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function IoTHub() {
  const temperatureData = [
    { time: "10:00", value: 21.5 },
    { time: "10:15", value: 22.0 },
    { time: "10:30", value: 22.4 },
    { time: "10:45", value: 22.3 },
  ];

  const moistureData = [
    { time: "10:00", value: 65 },
    { time: "10:15", value: 66 },
    { time: "10:30", value: 68 },
    { time: "10:45", value: 67 },
  ];

  const airQualityData = [
    { time: "10:00", value: 14 },
    { time: "10:15", value: 13 },
    { time: "10:30", value: 12 },
    { time: "10:45", value: 12 },
  ];

  const sensorData = [
    { time: "10:00", value: 1 },
    { time: "10:15", value: 3 },
    { time: "10:30", value: 5 },
    { time: "10:45", value: 60 },
  ];

  const uptimeData = [
    { time: "10:00", value: 100 },
    { time: "10:15", value: 100 },
    { time: "10:30", value: 100 },
    { time: "10:45", value: 100 },
  ];

  return (
    <div className="p-8 bg-green-50 min-h-screen text-green-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">📡 IoT Monitoring Hub</h1>
          <p className="text-green-700 text-lg">
            Track environmental conditions and device performance in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
          <SensorCard title="🌡️ Temperature (°C)" data={temperatureData} color="#047857" />
          <SensorCard title="💧 Soil Moisture (%)" data={moistureData} color="#0f766e" />
          <SensorCard title="🌳 Air Quality (PM2.5 µg/m³)" data={airQualityData} color="#15803d" />
          <SensorCard title=" Motion Sensors" data={sensorData} color="#15803d" />
          <SensorCard title="📶 Device Uptime (%)" data={uptimeData} color="#166534" />
        </div>
      </div>
    </div>
  );
}

function SensorCard({ title, data, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-green-200 p-6 transition duration-300 hover:shadow-xl">
      <h2 className="text-xl font-semibold text-green-900 mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}