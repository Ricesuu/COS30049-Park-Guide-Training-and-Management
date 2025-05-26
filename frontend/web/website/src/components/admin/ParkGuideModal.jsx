import React, { useEffect, useState } from "react";

export default function ParkGuideModal({ guide, onClose }) {
    const [parks, setParks] = useState({});

    useEffect(() => {
        document.body.style.overflow = "hidden";
        fetchParks();
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

    return (
        <div
            className="fixed inset-0 bg-transparent backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="bg-white w-[75vw] h-[75vh] p-6 rounded-xl shadow-lg overflow-y-auto animate-pop relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-4 right-4 text-green-900 hover:text-green-600 text-2xl font-bold"
                    onClick={onClose}
                >
                    &times;
                </button>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="text-green-900 space-y-2">
                        <h2 className="text-2xl font-bold">
                            {guide.first_name} {guide.last_name}
                        </h2>
                        <p>
                            <strong>Email:</strong> {guide.email}
                        </p>{" "}
                        <p>
                            <strong>License Status:</strong>{" "}
                            {guide.certification_status
                                .charAt(0)
                                .toUpperCase() +
                                guide.certification_status
                                    .slice(1)
                                    .toLowerCase()}
                        </p>{" "}
                        <p>
                            <strong>License Expiry Date:</strong>{" "}
                            {guide.license_expiry_date
                                ? new Date(
                                      guide.license_expiry_date
                                  ).toLocaleDateString()
                                : "N/A"}
                        </p>{" "}
                        <p>
                            <strong>Assigned Park:</strong>{" "}
                            {guide.assigned_park
                                ? parks[guide.assigned_park] || "Loading..."
                                : "N/A"}
                        </p>
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
