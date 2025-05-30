import React from "react";

const RecentActivityLogs = () => {
  const activityLogs = [
    { id: 1, action: "New guide registered", time: "2025-04-12 10:23 AM" },
    { id: 2, action: "License approved for John Doe", time: "2025-04-12 09:50 AM" },
    { id: 3, action: "IoT device synced", time: "2025-04-11 05:18 PM" },
    { id: 4, action: "Report submitted by visitor", time: "2025-04-11 03:42 PM" },
    { id: 5, action: "Guide Jane updated profile", time: "2025-04-10 01:07 PM" },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-green-800">Recent Activity Logs</h2>
      <table className="min-w-full text-sm text-left text-gray-600">
        <thead className="text-xs text-gray-700 uppercase bg-green-100">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Action</th>
            <th className="px-4 py-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {activityLogs.map((log) => (
            <tr key={log.id} className="border-b hover:bg-green-50">
              <td className="px-4 py-2 font-medium">{log.id}</td>
              <td className="px-4 py-2">{log.action}</td>
              <td className="px-4 py-2 text-gray-500">{log.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentActivityLogs;