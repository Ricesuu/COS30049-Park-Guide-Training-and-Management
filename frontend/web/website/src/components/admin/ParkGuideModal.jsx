import React, { useEffect, useState } from "react";

export default function ParkGuideModal({ guide, onClose }) {
    const [parks, setParks] = useState({});
    const [assignedModules, setAssignedModules] = useState([]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        fetchParks();
        fetchAssignedModules();
        return () => (document.body.style.overflow = "auto");
    }, []);

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
        } catch (err) {
            console.error("Error fetching parks:", err);
        }
    };

    const fetchAssignedModules = async () => {
        try {
            const res = await fetch("/api/assign_course?type=guides");
            if (!res.ok) throw new Error("Failed to fetch assigned modules");
            const guides = await res.json();
            const thisGuide = guides.find((g) => g.guide_id === guide.guide_id);
            setAssignedModules(thisGuide?.assigned_modules || []);
        } catch (err) {
            console.error("Error fetching assigned modules:", err);
        }
    };

    
    const getCertStatusColor = (status) => {
        if (!status) return "bg-gray-300 text-gray-800";
        if (status.toLowerCase() === "certified") return "bg-green-200 text-green-800";
        if (status.toLowerCase() === "pending") return "bg-yellow-200 text-yellow-800";
        return "bg-red-200 text-red-800";
    };

    return (
        <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-3xl h-[80vh] p-8 rounded-2xl shadow-2xl overflow-y-auto animate-pop relative border border-green-200"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-4 right-4 text-green-900 hover:text-green-600 text-3xl font-bold"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>

                <div className="flex flex-col md:flex-row gap-10 items-start">
                    
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl"></span>
                            <h2 className="text-2xl font-bold">
                                {guide.first_name} {guide.last_name}
                            </h2>
                        </div>
                        <div className="space-y-2">
                            <p>
                                <strong>Email:</strong>{" "}
                                <span className="text-green-800">{guide.email}</span>
                            </p>
                            <p>
                                <strong>Certification Status:</strong>{" "}
                                <span className={`inline-block px-2 py-0.5 rounded text-sm font-semibold ${getCertStatusColor(guide.certification_status)}`}>
                                    {guide.certification_status
                                        ? guide.certification_status.charAt(0).toUpperCase() +
                                          guide.certification_status.slice(1).toLowerCase()
                                        : "N/A"}
                                </span>
                            </p>
                            <p>
                                <strong>License Expiry Date:</strong>{" "}
                                <span className="text-green-800">
                                    {guide.license_expiry_date
                                        ? new Date(guide.license_expiry_date).toLocaleDateString()
                                        : "N/A"}
                                </span>
                            </p>
                            <p>
                                <strong>Assigned Park:</strong>{" "}
                                <span className="text-green-800">
                                    {guide.assigned_park
                                        ? parks[guide.assigned_park] || "Loading..."
                                        : "N/A"}
                                </span>
                            </p>
                        </div>
                    </div>

                    
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <span className="text-green-700"></span> Assigned Courses
                        </h3>
                        {assignedModules.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1">
                                {assignedModules.map((mod, idx) => (
                                    <li key={idx} className="text-green-900">{mod}</li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-gray-600 italic">No courses assigned.</div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .animate-pop {
                    animation: pop 0.25s ease-out forwards;
                }
                @keyframes pop {
                    0% {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );
}
