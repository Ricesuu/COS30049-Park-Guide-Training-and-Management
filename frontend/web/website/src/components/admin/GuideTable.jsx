import React from "react";
import { useNavigate } from "react-router-dom";

export default function GuideTable({ guides }) {
    const navigate = useNavigate();

    // ✅ Approve certification (ParkGuides table)
    const handleApprove = async (guideId) => {
        try {
            const res = await fetch(`/api/park-guides/${guideId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    certification_status: "certified",
                }),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Guide certified successfully.");
                window.location.reload(); // Or refresh state locally
            } else {
                alert("Certification failed: " + data.error);
            }
        } catch (err) {
            console.error("Certification error:", err);
            alert("Something went wrong.");
        }
    };

    return (
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
                        <th className="px-4 py-2">Details</th>
                    </tr>
                </thead>
                <tbody className="text-green-900">
                    {guides.map((guide) => (
                        <tr key={guide.guide_id} className="border-b">
                            <td className="px-4 py-2">{guide.guide_id}</td>
                            <td className="px-4 py-2">
                                {guide.first_name} {guide.last_name}
                            </td>
                            <td className="px-4 py-2">{guide.license_id}</td>
                            <td className="px-4 py-2">
                                {guide.user_status} / {guide.certification_status}
                            </td>
                            <td className="px-4 py-2 space-y-2">

                                {guide.certification_status !== "certified" && (
                                    <button
                                        onClick={() => handleApprove(guide.guide_id)}
                                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 w-full"
                                    >
                                        Certify Guide
                                    </button>
                                )}
                            </td>
                            <td className="px-4 py-2">
                                <button
                                    className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                                    onClick={() => navigate(`/guides/${guide.uid}`)}
                                >
                                    Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}