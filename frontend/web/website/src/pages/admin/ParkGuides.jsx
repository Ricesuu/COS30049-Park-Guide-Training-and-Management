import React, { useEffect, useState } from "react";
import GuideTable from "../../components/admin/GuideTable";

export default function ParkGuides() {
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch users with park guide role
    useEffect(() => {
        async function fetchGuideUsers() {
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
        }

        fetchGuideUsers();
    }, []);

    // Approve guide registration
    async function handleApprove(uid) {
        try {
            const res = await fetch(`/api/users/${uid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: "approved" }),
            });

            if (!res.ok) throw new Error("Approval failed");

            
            const updated = guides.map((guide) =>
                guide.uid === uid ? { ...guide, status: "approved" } : guide
            );
            setGuides(updated);
        } catch (err) {
            console.error("Error approving user:", err);
            setError(err.message);
        }
    }

    if (loading) {
        return <div className="p-6 text-green-900">Loading park guides...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-600">Error: {error}</div>;
    }

    return (
        <div className="p-6 space-y-6 text-green-900">
            <h1 className="text-2xl font-bold">Park Guide Management</h1>

            {/* Registration Approvals */}
            <div className="bg-green-100 rounded-xl p-4 shadow-md border border-green-300">
                <h2 className="text-xl font-semibold mb-4">Registration Approvals</h2>
                <div className="space-y-2">
                    {guides.filter((guide) => guide.status === "pending").length === 0 ? (
                        <div className="text-green-800">No pending registrations.</div>
                    ) : (
                        guides
                            .filter((guide) => guide.status === "pending")
                            .map((guide) => (
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
                            ))
                    )}
                </div>
            </div>

            {/* All Park Guides Table */}
            <GuideTable guides={guides} />
        </div>
    );
}
