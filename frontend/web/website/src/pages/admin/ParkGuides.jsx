import React, { useEffect, useState } from "react";
import GuideTable from "../../components/admin/GuideTable"; 

export default function ParkGuides() {
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGuides() {
            try {
                const res = await fetch("/api/park-guides");
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
                <h2 className="text-xl font-semibold mb-4">
                    License Approvals
                </h2>
                <div className="space-y-2">
                    {guides
                        .filter((guide) => guide.user_status === "pending")
                        .map((guide) => (
                            <div
                                key={guide.guide_id}
                                className="flex justify-between items-center bg-white p-3 rounded-lg shadow"
                            >
                                <span>
                                    {guide.first_name} {guide.last_name}{" "}
                                    (License: {guide.guide_id})
                                </span>
                                <button className="bg-green-800 text-white px-4 py-1 rounded hover:bg-green-700">
                                    Approve
                                </button>
                            </div>
                        ))}
                </div>
            </div>

            {/* All Park Guides Table */}
            <GuideTable guides={guides} />
        </div>
    );
}