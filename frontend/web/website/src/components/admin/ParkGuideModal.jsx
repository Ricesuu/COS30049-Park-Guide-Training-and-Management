import React, { useEffect } from "react";

export default function ParkGuideModal({ guide, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  return (
    <div
      className="fixed inset-0 bg-gray-300 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-[75vw] h-[75vh] p-6 rounded-xl shadow-lg overflow-y-auto animate-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-green-900 hover:text-green-600 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Modal Content */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <img
            src={guide.picture || "https://via.placeholder.com/150"}
            alt={`${guide.first_name} ${guide.last_name}`}
            className="w-36 h-36 rounded-full object-cover border-4 border-green-700"
          />
          <div className="text-green-900 space-y-2">
            <h2 className="text-2xl font-bold">
              {guide.first_name} {guide.last_name}
            </h2>
            <p><strong>License ID:</strong> {guide.license_id || "N/A"}</p>
            <p><strong>Status:</strong> {guide.user_status}</p>
            <p><strong>Date of Birth:</strong> {guide.dob || "N/A"}</p>
            <p><strong>Age:</strong> {guide.age || "N/A"}</p>
            <p><strong>Experience:</strong> {guide.experience || "N/A"} years</p>
            <p><strong>Skills:</strong> {(guide.skills || []).join(", ")}</p>
          </div>
        </div>
      </div>

      {/* Animation styles */}
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


