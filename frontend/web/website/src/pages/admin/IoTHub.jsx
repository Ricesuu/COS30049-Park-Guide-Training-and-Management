import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

export default function IoTHub() {
  const [sensorData, setSensorData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSensorData() {
      try {
        const res = await fetch("/api/iot-monitoring");
        if (!res.ok) throw new Error("Failed to fetch sensor data");

        const rawData = await res.json();
        
        // Group by sensor_type
        const grouped = {};
        rawData.forEach(({ sensor_type, recorded_value, time }) => {
          if (!grouped[sensor_type]) grouped[sensor_type] = [];
          grouped[sensor_type].push({ time, value: parseFloat(recorded_value) });
        });

        setSensorData(grouped);
      } catch (err) {
        console.error("Error fetching sensor data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSensorData();
  }, []);

  if (loading) return <div className="p-8 text-green-900">Loading IoT data...</div>;

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
          <SensorCard title="🌡️ Temperature (°C)" data={sensorData.temperature || []} color="#047857" />
          <SensorCard title="💧 Soil Moisture (%)" data={sensorData.soil_moisture || []} color="#0f766e" />
          <SensorCard title="🌬️ Humidity (%)" data={sensorData.humidity || []} color="#2563eb" />
          <SensorCard title="📶 Alert (%)" data={sensorData.distance || []} color="#166534" />
          {/* Add more SensorCards if needed */}
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