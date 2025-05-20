import React from "react";
import { useNavigate } from "react-router-dom";

export default function GuideTable({ guides }) {
    const navigate = useNavigate();

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
                    </tr>
                </thead>
                <tbody className="text-green-900">
                    {guides.map((guide) => (
                        <tr key={guide.guide_id} className="border-b">
                            <td className="px-4 py-2">{guide.guide_id}</td>
                            <td className="px-4 py-2">
                                {guide.first_name} {guide.last_name}
                            </td>
                            <td className="px-4 py-2">{guide.guide_id}</td>
                            <td className="px-4 py-2">
                                {guide.user_status}
                            </td>
                            <td>
                                {guide.certification_status !== "certified" && (
                                    <button
                                    onClick={() => handleApprove(guide.guide_id)}
                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                                    >
                                    Approve
                                    </button>
                                )}
                            </td>
                            <td className="px-4 py-2 space-x-2">
                                <button
                                    className="bg-green-800 text-white px-3 py-1 rounded hover:bg-green-700"
                                    onClick={() =>
                                        navigate(`/guides/${guide.guide_id}`)
                                    }
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