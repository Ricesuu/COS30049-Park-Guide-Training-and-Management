import React, { useState, useEffect } from "react";
import ParkGuideModal from "./ParkGuideModal";
import TransactionApprovalTable from "./TransactionApprovalTable";

export default function GuideTable({ guides, onCertify, onDelete }) {
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [activeTab, setActiveTab] = useState("certification");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [guideToDelete, setGuideToDelete] = useState(null);
    const [parks, setParks] = useState({});
    const capitalizeFirstLetter = (string) => {
        if (!string) return "";
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    useEffect(() => {
        const fetchParks = async () => {
            try {
                const res = await fetch("/api/parks");
                if (!res.ok) throw new Error("Failed to fetch parks");
                const parkData = await res.json();

                // Create a mapping of park_id to park_name
                const parkMap = parkData.reduce((acc, park) => {
                    acc[park.park_id] = park.park_name;
                    return acc;
                }, {});

                setParks(parkMap);
            } catch (error) {
                console.error("Error fetching parks:", error);
            }
        };

        fetchParks();
    }, []);

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

    const confirmDelete = (guide) => {
        setGuideToDelete(guide);
        setShowConfirmModal(true);
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(
                `/api/park-guides/${guideToDelete.guide_id}`,
                {
                    method: "DELETE",
                }
            );

            if (!res.ok) throw new Error("Failed to delete guide");
            alert("Park guide deleted successfully.");
            if (onDelete) onDelete(guideToDelete.guide_id);
        } catch (err) {
            console.error("Error deleting guide:", err);
            alert("Failed to delete guide.");
        } finally {
            setShowConfirmModal(false);
            setGuideToDelete(null);
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-md border border-green-300 overflow-x-auto">
                {/* Tabs */}
                <div className="flex border-b bg-green-50">
                    {["certification", "transaction", "allGuides"].map(
                        (tab) => (
                            <button
                                key={tab}
                                className={`px-6 py-3 text-sm font-semibold capitalize ${
                                    activeTab === tab
                                        ? "border-b-2 border-green-600 text-green-900"
                                        : "text-green-500 hover:text-green-700"
                                }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab === "certification"
                                    ? "Certification Approval"
                                    : tab === "transaction"
                                    ? "Transaction Approval"
                                    : "All Park Guides"}
                            </button>
                        )
                    )}
                </div>

                {/* Tab Contents */}
                {activeTab === "certification" ? (
                    guides.length === 0 ? (
                        <div className="p-4 text-green-800">
                            No guides found.
                        </div>
                    ) : (
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-green-200 text-green-800">
                                <tr>
                                    <th className="px-4 py-2">ID</th>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Email</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2">
                                        License Status
                                    </th>
                                    <th className="px-4 py-2">
                                        License Expiry
                                    </th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-green-900">
                                {guides.map((guide) => (
                                    <tr
                                        key={guide.guide_id}
                                        onClick={() =>
                                            handleRowClick(guide.guide_id)
                                        }
                                        className="border-b cursor-pointer hover:bg-green-50 transition"
                                    >
                                        <td className="px-4 py-2">
                                            {guide.guide_id}
                                        </td>
                                        <td className="px-4 py-2">
                                            {guide.first_name} {guide.last_name}
                                        </td>
                                        <td className="px-4 py-2">
                                            {guide.email}
                                        </td>
                                        <td className="px-4 py-2">
                                            {capitalizeFirstLetter(
                                                guide.user_status
                                            )}
                                        </td>{" "}
                                        <td className="px-4 py-2">
                                            {capitalizeFirstLetter(
                                                guide.certification_status
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            {guide.license_expiry_date
                                                ? new Date(
                                                      guide.license_expiry_date
                                                  ).toLocaleDateString()
                                                : ""}
                                        </td>{" "}
                                        <td
                                            className="px-4 py-2"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {guide.certification_status !==
                                                "certified" &&
                                                guide.certification_status !==
                                                    "not applicable" && (
                                                    <button
                                                        onClick={() =>
                                                            onCertify(
                                                                guide.guide_id
                                                            )
                                                        }
                                                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                ) : activeTab === "transaction" ? (
                    <div className="p-4 text-green-800">
                        <TransactionApprovalTable />
                    </div>
                ) : (
                    <div className="p-4">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-green-200 text-green-800">
                                <tr>
                                    {" "}
                                    <th className="px-4 py-2">ID</th>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Email</th>
                                    <th className="px-4 py-2">Assigned Park</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-green-900">
                                {guides.map((guide) => (
                                    <tr
                                        key={guide.guide_id}
                                        className="border-b hover:bg-green-50 transition"
                                    >
                                        <td className="px-4 py-2">
                                            {guide.guide_id}
                                        </td>
                                        <td className="px-4 py-2">
                                            {guide.first_name} {guide.last_name}
                                        </td>{" "}
                                        <td className="px-4 py-2">
                                            {guide.email}
                                        </td>
                                        <td className="px-4 py-2">
                                            {guide.assigned_park
                                                ? parks[guide.assigned_park] ||
                                                  "Loading..."
                                                : "N/A"}
                                        </td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() =>
                                                    confirmDelete(guide)
                                                }
                                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedGuide && (
                <ParkGuideModal
                    guide={selectedGuide}
                    onClose={() => setSelectedGuide(null)}
                />
            )}

            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md text-center space-y-4">
                        <h2 className="text-xl font-semibold text-red-700">
                            Confirm Deletion
                        </h2>
                        <p className="text-gray-700">
                            Are you sure you want to delete{" "}
                            <strong>
                                {guideToDelete?.first_name}{" "}
                                {guideToDelete?.last_name}
                            </strong>
                            ? This will remove both their park guide and user
                            record.
                        </p>
                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={() => setShowConfirmModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                onClick={handleDelete}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
