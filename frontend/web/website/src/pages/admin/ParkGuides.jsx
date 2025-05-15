import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:3000/api";

export default function ParkGuides() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/park-guides`);
      if (!response.ok) throw new Error("Failed to fetch guides");
      const data = await response.json();
      setGuides(data);
      setError(null);
    } catch (err) {
      setError("Error loading guides: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const approveGuide = async (guideId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/park-guides/${guideId}/approve`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Failed to approve guide");
      await fetchGuides();
    } catch (err) {
      alert("Approval failed: " + err.message);
    }
  };

  const deleteGuide = async (guideId) => {
    if (window.confirm("Are you sure you want to delete this guide?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/park-guides/${guideId}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete guide");
        await fetchGuides();
      } catch (err) {
        alert("Delete failed: " + err.message);
      }
    }
  };

  if (loading) return <div className="p-4 text-green-950">Loading guides...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-6 text-green-900 space-y-6">
      <h1 className="text-2xl font-bold">Park Guide Management</h1>

      
      <div className="bg-green-100 rounded-xl p-4 shadow-md border border-green-300">
        <h2 className="text-xl font-semibold mb-4">License Approvals</h2>
        <div className="space-y-2">
          {guides.filter(g => g.status === "Pending").map((g) => (
            <div key={g.id} className="flex justify-between items-center bg-white p-3 rounded-lg shadow">
              <span>{g.name} (License: {g.licenseId})</span>
              <button
                onClick={() => approveGuide(g.id)}
                className="bg-green-800 text-white px-4 py-1 rounded hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      </div>

      
      <div className="bg-white rounded-xl shadow-md overflow-auto border border-green-300">
        <h2 className="text-xl font-semibold p-4 border-b bg-green-50">All Park Guides</h2>
        <table className="min-w-full text-sm text-left">
          <thead className="bg-green-200 text-green-800">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">License ID</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="text-green-900">
            {guides.map((guide) => (
              <tr key={guide.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{guide.id}</td>
                <td className="px-4 py-2">{guide.name}</td>
                <td className="px-4 py-2">{guide.licenseId}</td>
                <td className="px-4 py-2">{guide.status}</td>
                <td className="px-4 py-2 space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => navigate(`/guides/${guide.id}`)}
                    className="bg-green-800 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => deleteGuide(guide.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
