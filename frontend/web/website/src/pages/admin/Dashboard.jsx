import React, { useEffect, useState } from "react";
import IoTGraphs from "../../components/admin/IoTGraphs";
import PendingRegistrationTable from "../../components/admin/PendingRegistrationTable";
import { API_URL } from "../../config/apiConfig";

export default function Dashboard() {
  const [counts, setCounts] = useState({
    registrations: 0,
    licenses: 0,
    alerts: 0,
  });
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const usersRes = await fetch(`${API_URL}/api/users`);
        const users = await usersRes.json();
        const pendingUsers = users.filter((u) => u.status === "pending").length;

        const guidesRes = await fetch(`${API_URL}/api/park-guides`);
        const guides = await guidesRes.json();
        const pendingCerts = guides.filter(
          (g) => g.certification_status === "pending"
        ).length;

        const alertsRes = await fetch(`${API_URL}/api/active-alerts`);
        const alerts = await alertsRes.json();

        setCounts({
          registrations: pendingUsers,
          licenses: pendingCerts,
          alerts: alerts.length,
        });
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="flex-1 p-8 bg-gray-100 min-h-screen space-y-8">
      <h2 className="text-2xl font-semibold text-green-900">
        Welcome to SFC Admin Dashboard
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Licenses Renewal"
          value={counts.licenses}
          color="yellow"
        />
        <SummaryCard
          title="Registrations Approval"
          value={counts.registrations}
          color="blue"
        />
        <SummaryCard title="Alerts" value={counts.alerts} color="red" />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow border border-green-200">
        <h3 className="text-lg font-semibold text-green-900 mb-4">
          IoT Sensor Activity
        </h3>
        <IoTGraphs />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow border border-green-200">
        <h3 className="text-lg font-semibold text-green-900 mb-4">
          Registration Approval
        </h3>
        <PendingRegistrationTable />
      </div>
    </div>
  );
}

function SummaryCard({ title, value, color }) {
  const colorMap = {
    yellow: "border-yellow-500 text-yellow-800",
    blue: "border-blue-500 text-blue-800",
    red: "border-red-500 text-red-800",
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow p-4 border-l-4 ${colorMap[color]}`}
    >
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className={`text-2xl font-bold ${colorMap[color]}`}>{value}</p>
    </div>
  );
}
