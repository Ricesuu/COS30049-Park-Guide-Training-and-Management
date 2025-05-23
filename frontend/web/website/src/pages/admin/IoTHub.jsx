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

export default function IoTHub() {
  const [sensorData, setSensorData] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const sensorRes = await fetch("/api/iot-monitoring");
        const alertsRes = await fetch("/api/active-alerts");

        if (!sensorRes.ok || !alertsRes.ok) throw new Error("Failed to fetch data");

        const sensorJson = await sensorRes.json();
        const alertsJson = await alertsRes.json();

        const grouped = {};
        sensorJson.forEach(({ sensor_type, recorded_value, recorded_at }) => {
          if (!grouped[sensor_type]) grouped[sensor_type] = [];
          grouped[sensor_type].push({
            time: new Date(recorded_at).toLocaleTimeString(),
            value: parseFloat(recorded_value),
          });
        });

        setSensorData(grouped);
        setAlerts(alertsJson);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10s
    return () => clearInterval(interval);
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

        
        {alerts.length > 0 && (
          <div className="bg-red-100 border border-red-300 p-4 rounded-xl mb-6">
            <h2 className="text-xl font-bold text-red-800 mb-2">⚠️ Active Alerts</h2>
            {alerts.map(alert => (
              <div key={alert.alert_id} className="mb-1 text-red-700">
                {alert.message} (Sensor: {alert.sensor_type}, Value: {alert.recorded_value})
              </div>
            ))}
          </div>
        )}

        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
          <SensorCard title=" Temperature (°C)" data={sensorData.temperature || []} color="#047857" />
          <SensorCard title=" Soil Moisture (%)" data={sensorData["soil moisture"] || []} color="#0f766e" />
          <SensorCard title=" Humidity (%)" data={sensorData.humidity || []} color="#2563eb" />
          <SensorCard title=" Motion Activity" data={sensorData.motion || []} color="#92400e" />
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