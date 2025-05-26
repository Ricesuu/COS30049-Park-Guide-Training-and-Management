import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function IoTGraphs() {
  const [data, setData] = useState({
    temperature: [],
    humidity: [],
    "soil moisture": [],
    motion: [],
  });

  const fetchData = async () => {
    try {
      const res = await fetch("/api/iot-monitoring");
      const raw = await res.json();

      const grouped = {
        temperature: [],
        humidity: [],
        "soil moisture": [],
        motion: [],
      };

      raw.forEach((item) => {
        const entry = {
          time: new Date(item.recorded_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          value: parseFloat(item.recorded_value),
        };
        if (grouped[item.sensor_type]) {
          grouped[item.sensor_type].push(entry);
        }
      });

      // Reverse each sensor array so oldest is first
      Object.keys(grouped).forEach((key) => {
        grouped[key].reverse();
      });

      setData(grouped);
    } catch (err) {
      console.error("Error fetching IoT data:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      <SensorCard
        title="Temperature (°C)"
        data={data.temperature}
        color="#047857"
      />
      <SensorCard
        title="Soil Moisture (%)"
        data={data["soil moisture"]}
        color="#0f766e"
      />
      <SensorCard title="Humidity (%)" data={data.humidity} color="#2563eb" />
      <SensorCard
        title="Motion Activity"
        data={data.motion}
        color="#92400e"
      />
    </div>
  );
}

function SensorCard({ title, data, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-green-200 p-6 transition duration-300 hover:shadow-xl">
      <h2 className="text-xl font-semibold text-green-900 mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={280}>
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

