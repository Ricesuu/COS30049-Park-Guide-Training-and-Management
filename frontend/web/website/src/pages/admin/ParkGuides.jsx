import React, { useEffect, useState } from "react";
import GuideTable from "../../components/admin/GuideTable";
import { Check, X } from "lucide-react";

export default function ParkGuides() {
    const [guides, setGuides] = useState([]);
    const [guide, setGuide] = useState([]);
    const [loading, setLoading] = useState(true); // Initial data load
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null); // For approve/reject (stores UID)
    const [certifyLoading, setCertifyLoading] = useState(null); // For certify (stores guideId)

    useEffect(() => {
        fetchGuides();
        fetchGuide();
    }, []);

    const fetchGuide = async () => {
        setLoading(true);
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

    const fetchGuides = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/users");
            if (!res.ok) throw new Error("Failed to fetch users");
            const data = await res.json();
            const parkGuides = data.filter(user => user.role === "park_guide");
            setGuides(parkGuides);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCertify = async (guideId) => {
        setCertifyLoading(guideId);
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

            await fetchGuide(); 
        } catch (err) {
            console.error("Certify error:", err);
            alert("Error: " + err.message);
        } finally {
            setCertifyLoading(null);
        }
    };

    const handleApprove = async (uid) => {
        setActionLoading(uid);
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

            await fetchGuides(); 
            await fetchGuide(); 
        } catch (err) {
            console.error("Error approving user:", err);
            setError(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (uid) => {
        setActionLoading(uid);
        try {
            const res = await fetch(`/api/users/${uid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: "rejected" }),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Rejection failed");

            await fetchGuides();
            await fetchGuide();
        } catch (err) {
            console.error("Error rejecting user:", err);
            setError(err.message);
        } finally {
            setActionLoading(null);
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
                                className="flex items-center justify-between bg-white p-3 rounded-lg shadow"
                            >
                                <span>
                                    {guide.first_name} {guide.last_name} (UID: {guide.uid})
                                </span>
                                <div className="flex gap-2 min-w-[100px] justify-end">
                                    {actionLoading === guide.uid ? (
                                        // Spinner animation (Tailwind) or use "Processing..." text
                                        <span className="flex items-center gap-2 text-green-700">
                                            <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleApprove(guide.uid)}
                                                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full"
                                                title="Approve"
                                            >
                                                <Check className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleReject(guide.uid)}
                                                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
                                                title="Reject"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* All Park Guides Table */}
            <GuideTable
                guides={guide}
                onCertify={handleCertify}
                onDelete={fetchGuide} // This will refresh the table after delete
            />
        </div>
    );
}
