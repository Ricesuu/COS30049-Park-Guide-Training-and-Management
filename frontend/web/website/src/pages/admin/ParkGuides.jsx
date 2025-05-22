import React, { useEffect, useState } from "react";
import GuideTable from "../../components/admin/GuideTable";

export default function ParkGuides() {
    const [guides, setGuides] = useState([]);
    const [guide, setGuide] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchGuides();
    }, []);

    useEffect(() => {
        fetchGuide();
    }, []);

    const fetchGuide = async () => {
        try {
            const res = await fetch("/api/park-guides");
            if (!res.ok) throw new Error("Failed to fetch park guides");
            const data = await res.json();
            setGuide(data);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

     const handleCertify = async (guideId) => {
        try {
            const res = await fetch(`/api/park-guides/${guideId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ certification_status: "certified" }),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Certification failed");

            // Refresh state after update
            setGuides(prev =>
                prev.map(guide =>
                    guide.guide_id === guideId
                        ? { ...guide, certification_status: "certified" }
                        : guide
                )
            );
        } catch (err) {
            console.error("Certify error:", err);
            alert("Error: " + err.message);
        }
    };


    const fetchGuides = async () => {
        try {
            const res = await fetch("/api/users");
            if (!res.ok) throw new Error("Failed to fetch users");
            const data = await res.json();

            // Filter only park guides
            const parkGuides = data.filter(user => user.role === "park_guide");
            setGuides(parkGuides);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (uid) => {
        try {
            const res = await fetch(`/api/users/${uid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: "approved" }),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Approval failed");

            setGuides(prev =>
                prev.map(guide =>
                    guide.uid === uid ? { ...guide, status: "approved" } : guide
                )
            );
        } catch (err) {
            console.error("Error approving user:", err);
            setError(err.message);
        }
    };

    const pendingGuides = guides.filter(guide => guide.status === "pending");

    if (loading) return <div className="p-6 text-green-900">Loading park guides...</div>;
    if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

    return (
        <div className="p-6 space-y-6 text-green-900">
            <h1 className="text-2xl font-bold">Park Guide Management</h1>

            
            <div className="bg-green-100 rounded-xl p-4 shadow-md border border-green-300">
                <h2 className="text-xl font-semibold mb-4">Registration Approvals</h2>
                {pendingGuides.length === 0 ? (
                    <div className="text-green-800">No pending registrations.</div>
                ) : (
                    <div className="space-y-2">
                        {pendingGuides.map((guide) => (
                            <div
                                key={guide.uid}
                                className="flex justify-between items-center bg-white p-3 rounded-lg shadow"
                            >
                                <span>
                                    {guide.first_name} {guide.last_name} (UID: {guide.uid})
                                </span>
                                <button
                                    onClick={() => handleApprove(guide.uid)}
                                    className="bg-green-800 text-white px-4 py-1 rounded hover:bg-green-700"
                                >
                                    Approve
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* All Park Guides Table */}
            <GuideTable guides={guide} onCertify={handleCertify} />
        </div>
    );
}
