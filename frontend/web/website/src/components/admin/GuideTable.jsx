import React, { useState, useEffect } from "react";
import ParkGuideModal from "./ParkGuideModal";
import TransactionApprovalTable from "./TransactionApprovalTable";
import CertificationApprovalTable from "./CertificationApprovalTable";

export default function GuideTable({ guides, onCertify, onDelete, certificationLoading }) {
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [guideToDelete, setGuideToDelete] = useState(null);
    const [parks, setParks] = useState({});
    const [activeTab, setActiveTab] = useState("certification");
    const [deleteLoading, setDeleteLoading] = useState(null); // NEW
    const [certifying, setCertifying] = useState(null); // NEW

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
        setDeleteLoading(guideToDelete.guide_id); // NEW
        try {
            const res = await fetch(
                `/api/park-guides/${guideToDelete.guide_id}`,
                {
                    method: "DELETE",
                }
            );
            if (!res.ok) throw new Error("Failed to delete guide");
            alert("Park guide deleted successfully.");
            setShowConfirmModal(false);
            setGuideToDelete(null);
            setDeleteLoading(null);
            if (onDelete) onDelete(); // Call parent refresh
        } catch (err) {
            console.error("Error deleting guide:", err);
            alert("Failed to delete guide.");
            setShowConfirmModal(false);
            setGuideToDelete(null);
            setDeleteLoading(null);
        }
    };

    // Table data
    const certificationGuides = guides.filter(
        (guide) =>
            guide.certification_status !== "certified" &&
            guide.certification_status !== "not applicable"
    );

    // Tab content
    const renderTabContent = () => {
        switch (activeTab) {
            case "certification":
                return (
                    <>
                        <h2 className="text-xl font-semibold p-4 border-b bg-green-50 text-green-900">
                            Certification Approval
                        </h2>
                        <CertificationApprovalTable
                          guides={guides}
                          onCertify={handleCertify}
                          loading={certificationLoading}
                          certifying={certifying}
                          onRowClick={handleRowClick}
                        />
                    </>
                );
            case "guides":
                return (
                    <>
                        <h2 className="text-xl font-semibold p-4 border-b bg-green-50 text-green-900">
                            All Park Guides
                        </h2>
                        {guides.length === 0 ? (
                            <div className="p-4 text-green-800">No guides found.</div>
                        ) : (
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-green-200 text-green-800">
                                    <tr>
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
                                            </td>
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
                                                {deleteLoading === guide.guide_id ? (
                                                    <span className="flex items-center gap-2 text-green-700">
                                                        <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                                        </svg>
                                                        Deleting...
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            confirmDelete(guide)
                                                        }
                                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </>
                );
            case "transactions":
                return (
                    <>
                        <TransactionApprovalTable />
                    </>
                );
            default:
                return null;
        }
    };

    const handleCertify = async (guideId) => {
        setCertifying(guideId);
        try {
            await onCertify(guideId);
        } finally {
            setCertifying(null);
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-md border border-green-300 overflow-x-auto mb-8">
                {/* Tabs */}
                <div className="flex border-b bg-green-50">
                    <button
                        className={`px-4 py-2 font-semibold transition ${
                            activeTab === "certification"
                                ? "border-b-2 border-green-600 text-green-800"
                                : "text-green-700 hover:text-green-900"
                        }`}
                        onClick={() => setActiveTab("certification")}
                    >
                        Certification Approval
                    </button>
                    <button
                        className={`px-4 py-2 font-semibold transition ${
                            activeTab === "guides"
                                ? "border-b-2 border-green-600 text-green-800"
                                : "text-green-700 hover:text-green-900"
                        }`}
                        onClick={() => setActiveTab("guides")}
                    >
                        All Park Guides
                    </button>
                    <button
                        className={`px-4 py-2 font-semibold transition ${
                            activeTab === "transactions"
                                ? "border-b-2 border-green-600 text-green-800"
                                : "text-green-700 hover:text-green-900"
                        }`}
                        onClick={() => setActiveTab("transactions")}
                    >
                        Transaction Approvals
                    </button>
                </div>
                {/* Tab Content */}
                <div>{renderTabContent()}</div>
            </div>

            {/* Park Guide Modal */}
            {selectedGuide && (
                <ParkGuideModal
                    guide={selectedGuide}
                    onClose={() => setSelectedGuide(null)}
                />
            )}

            {/* Confirm Delete Modal */}
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
                                disabled={deleteLoading !== null}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                onClick={handleDelete}
                                disabled={deleteLoading !== null}
                            >
                                {deleteLoading !== null ? (
                                    <span className="flex items-center gap-2 justify-center">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                        </svg>
                                        Deleting...
                                    </span>
                                ) : (
                                    "Confirm"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
