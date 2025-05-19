import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ParkGuides() {
  const navigate = useNavigate();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch park guides from the API
  useEffect(() => {
    async function fetchGuides() {
      try {
        const res = await fetch('/api/park-guides'); // Make sure this route matches your API
        const data = await res.json();
        setGuides(data);
      } catch (error) {
        console.error("Failed to load park guides:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGuides();
  }, []);

  if (loading) {
    return <div className="p-6 text-green-900">Loading park guides...</div>;
  }

  return (
    <div className="p-6 space-y-6 text-green-900">
      <h1 className="text-2xl font-bold">Park Guide Management</h1>

      {/* License Approvals */}
      <div className="bg-green-100 rounded-xl p-4 shadow-md border border-green-300">
        <h2 className="text-xl font-semibold mb-4">License Approvals</h2>
        <div className="space-y-2">
          {guides
            .filter((guide) => guide.certification_status === "Pending")
            .map((guide) => (
              <div
                key={guide.guide_id}
                className="flex justify-between items-center bg-white p-3 rounded-lg shadow"
              >
                <span>{guide.first_name} {guide.last_name} (License: {guide.guide_id})</span>
                <button className="bg-green-800 text-white px-4 py-1 rounded hover:bg-green-700">
                  Approve
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* All Park Guides */}
      <div className="bg-white rounded-xl shadow-md overflow-auto border border-green-300">
        <h2 className="text-xl font-semibold p-4 border-b bg-green-50">
          All Park Guides
        </h2>
        <table className="min-w-full text-sm text-left">
          <thead className="bg-green-200 text-green-800">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">License ID</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-green-900">
            {guides.map((guide) => (
              <tr key={guide.guide_id} className="border-b">
                <td className="px-4 py-2">{guide.guide_id}</td>
                <td className="px-4 py-2">{guide.first_name} {guide.last_name}</td>
                <td className="px-4 py-2">{guide.guide_id}</td>
                <td className="px-4 py-2">{guide.certification_status}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    className="bg-green-800 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={() => navigate(`/guides/${guide.guide_id}`)}
                  >
                    Details
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