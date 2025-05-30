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
  const [ackLoading, setAckLoading] = useState(null); // Track which alert is being acknowledged

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
            time: new Date(recorded_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            value: parseFloat(recorded_value),
          });
        });

        // Reverse each sensor array so oldest is first (ascending time)
        Object.keys(grouped).forEach(key => {
          grouped[key].reverse();
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

  // Acknowledge alert by alert_id
  const acknowledgeAlert = async (alert_id) => {
    setAckLoading(alert_id);
    try {
      const res = await fetch("/api/active-alerts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alert_id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to acknowledge alert");
      }
      // Remove the alert from the UI
      setAlerts((prev) => prev.filter((alert) => alert.alert_id !== alert_id));
    } catch (err) {
      alert("Failed to acknowledge alert: " + err.message);
    } finally {
      setAckLoading(null);
    }
  };

  if (loading) return <div className="p-8 text-green-900">Loading IoT data...</div>;

  const unacknowledgedAlerts = alerts.filter(alert => alert.is_acknowledged === 0);

  return (
    <div className="p-8 bg-green-50 min-h-screen text-green-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2"> IoT Monitoring Hub</h1>
          <p className="text-green-700 text-lg">
            Track environmental conditions and device performance in real-time.
          </p>
        </div>

       
        {unacknowledgedAlerts.length > 0 && (
          <div className="bg-red-100 border border-red-300 p-4 rounded-xl mb-6">
            <h2 className="text-xl font-bold text-red-800 mb-2">⚠️ Active Alerts</h2>
            <div className="space-y-2">
              {unacknowledgedAlerts.map(alert => (
                <div
                  key={alert.alert_id}
                  className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-4 py-2"
                >
                  <div>
                    <span className="font-semibold">{alert.message}</span>
                    <span className="ml-2 text-sm text-red-700">
                      (Sensor: <span className="font-mono">{alert.sensor_type}</span>, Value: <span className="font-mono">{alert.recorded_value}</span>
                      {alert.recorded_at && (
                        <> at {new Date(alert.recorded_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</>
                      )}
                      )
                    </span>
                  </div>
                  <button
                    onClick={() => acknowledgeAlert(alert.alert_id)}
                    className="ml-4 bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-3 py-1 rounded transition disabled:opacity-60"
                    title="Acknowledge alert"
                    disabled={ackLoading === alert.alert_id}
                  >
                    {ackLoading === alert.alert_id ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                        Acknowledging...
                      </span>
                    ) : (
                      "Acknowledge"
                    )}
                  </button>
                </div>
              ))}
            </div>
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