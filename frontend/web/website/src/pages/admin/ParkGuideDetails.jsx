import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:3000/api";

export default function ParkGuideDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGuide() {
      try {
        const res = await fetch(`${API_BASE_URL}/park-guides/${id}`);
        if (!res.ok) throw new Error("Failed to fetch guide details.");
        const data = await res.json();
        setGuide(data);
      } catch (err) {
        console.error("Error fetching guide:", err);
        setError("Unable to load guide details.");
      } finally {
        setLoading(false);
      }
    }

    fetchGuide();
  }, [id]);

  if (loading) return <div className="p-6 text-green-900">Loading...</div>;
  if (error || !guide)
    return (
      <div className="p-6 text-red-600">
        {error || "Park guide not found."}
      </div>
    );

  return (
    <div className="p-6 space-y-4 text-green-900">
      <h1 className="text-3xl font-bold">Park Guide Details</h1>

      <div className="bg-white p-6 rounded-xl shadow-md flex gap-6 items-start border border-green-300">
        <img
          src={guide.picture || "https://via.placeholder.com/150"}
          alt={`${guide.first_name} ${guide.last_name}`}
          className="w-32 h-32 object-cover rounded-full border-4 border-green-600"
        />

        <div className="space-y-2 text-sm">
          <p><strong>Full Name:</strong> {guide.first_name} {guide.last_name}</p>
          <p><strong>Email:</strong> {guide.email}</p>
          <p><strong>Status:</strong> {guide.user_status}</p>
          <p><strong>Certification:</strong> {guide.certification_status}</p>
          <p><strong>Assigned Park:</strong> {guide.assigned_park || "N/A"}</p>
          <p><strong>License Expiry:</strong> {guide.license_expiry_date || "N/A"}</p>
        </div>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-4 bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        ← Back
      </button>
    </div>
  );
}
