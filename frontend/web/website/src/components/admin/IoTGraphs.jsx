import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";

export default function IoTGraphs() {
  const [data, setData] = useState({
    temperature: [],
    humidity: [],
    soil_moisture: [],
    motion: []
  });

  const fetchData = async () => {
    try {
      const res = await fetch("/api/iot-monitoring");
      const raw = await res.json();

      const grouped = {
        temperature: [],
        humidity: [],
        soil_moisture: [],
        motion: [],
      };

      raw.reverse().forEach(item => {
        const entry = {
            time: new Date(item.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            value: parseFloat(item.recorded_value),
        };
        if (grouped[item.sensor_type]) {
            grouped[item.sensor_type].push(entry);
        }
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <SensorChart title=" Temperature (°C)" data={data.temperature} color="#047857" />
      <SensorChart title=" Humidity (%)" data={data.humidity} color="#2563eb" />
      <SensorChart title=" Soil Moisture (%)" data={data.soil_moisture} color="#0f766e" />
      <SensorChart title=" Motion" data={data.motion} color="#92400e" />
    </div>
  );
}

function SensorChart({ title, data, color }) {
  const isMotion = title.toLowerCase().includes("motion");

  return (
    <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
      <h2 className="text-lg font-semibold text-green-800 mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis reversed={isMotion} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

