import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PendingRegistrationTable() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Failed to fetch users");

        const data = await res.json();
        const filtered = data.filter(user => user.status === "pending");
        setPendingUsers(filtered);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const handleClick = () => {
    navigate("/dashboard/park-guides");
  };

  return (
    <div
      onClick={handleClick}
      className="bg-amber-50 rounded-xl shadow-md border border-amber-400 cursor-pointer hover:shadow-lg transition"
    >
      <h2 className="text-xl font-semibold p-4 border-b bg-amber-200 text-amber-900">
        Pending Registrations
      </h2>

      {loading ? (
        <div className="p-4 text-amber-700">Loading...</div>
      ) : pendingUsers.length === 0 ? (
        <div className="p-4 text-amber-700">No pending registrations.</div>
      ) : (
        <table className="min-w-full text-sm text-left text-amber-900">
          <thead className="bg-amber-100 text-amber-800">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map(user => (
              <tr key={user.uid} className="border-t border-amber-200 hover:bg-amber-100">
                <td className="px-4 py-2">
                  {user.first_name} {user.last_name}
                </td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 capitalize">{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

