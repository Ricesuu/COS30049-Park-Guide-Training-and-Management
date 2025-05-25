import React, { useState } from "react";
import GuideDetailsModal from "./ParkGuideModal";
import ParkGuideModal from "./ParkGuideModal";

export default function GuideTable({ guides, onCertify }) {
  const [selectedGuide, setSelectedGuide] = useState(null);

  const handleRowClick = async (guideId) => {
    try {
      const res = await fetch(`/api/park-guides/${guideId}`);
      if (!res.ok) throw new Error("Failed to fetch guide details");
      const data = await res.json();
      setSelectedGuide(data);
    } catch (err) {
      console.error("Error fetching guide:", err);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md border border-green-300 overflow-x-auto">
        <h2 className="text-xl font-semibold p-4 border-b bg-green-50">All Park Guides</h2>
        {guides.length === 0 ? (
          <div className="p-4 text-green-800">No guides found.</div>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead className="bg-green-200 text-green-800">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Certification</th>
                <th className="px-4 py-2">License Expiry</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-green-900">
              {guides.map((guide) => (
                <tr
                  key={guide.guide_id}
                  onClick={() => handleRowClick(guide.guide_id)}
                  className="border-b cursor-pointer hover:bg-green-50 transition"
                >
                  <td className="px-4 py-2">{guide.guide_id}</td>
                  <td className="px-4 py-2">{guide.first_name} {guide.last_name}</td>
                  <td className="px-4 py-2">{guide.email}</td>
                  <td className="px-4 py-2">{guide.user_status}</td>
                  <td className="px-4 py-2">{guide.certification_status}</td>
                  <td className="px-4 py-2">{guide.license_expiry_date}</td>
                  <td className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
                    {guide.certification_status !== "certified" && (
                      <button
                        onClick={() => onCertify(guide.guide_id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Certify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedGuide && (
        <ParkGuideModal
          guide={selectedGuide}
          onClose={() => setSelectedGuide(null)}
        />
      )}
    </>
  );
}

