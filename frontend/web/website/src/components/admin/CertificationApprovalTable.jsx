import React from "react";

export default function CertificationApprovalTable({
  guides,
  onCertify,
  loading,
  certifying,
  onRowClick,
}) {
  const certificationGuides = guides.filter(
    (guide) =>
      guide.certification_status !== "certified" &&
      guide.certification_status !== "not applicable"
  );

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-green-300 overflow-x-auto mb-8">
      {loading ? (
        <div className="p-4 flex items-center gap-2 text-green-800">
          <svg
            className="animate-spin h-5 w-5 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          Loading certification approvals...
        </div>
      ) : certificationGuides.length === 0 ? (
        <div className="p-4 text-green-800">
          No guides pending certification.
        </div>
      ) : (
        <table className="min-w-full text-sm text-left">
          <thead className="bg-green-200 text-green-800">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">License Status</th>
              <th className="px-4 py-2">License Expiry</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-green-900">
            {certificationGuides.map((guide) => (
              <tr
                key={guide.guide_id}
                onClick={() => onRowClick && onRowClick(guide.guide_id)}
                className="border-b cursor-pointer hover:bg-green-50 transition"
              >
                <td className="px-4 py-2">{guide.guide_id}</td>
                <td className="px-4 py-2">
                  {guide.first_name} {guide.last_name}
                </td>
                <td className="px-4 py-2">{guide.email}</td>
                <td className="px-4 py-2">
                  {capitalizeFirstLetter(guide.user_status)}
                </td>
                <td className="px-4 py-2">
                  {capitalizeFirstLetter(guide.certification_status)}
                </td>
                <td className="px-4 py-2">
                  {guide.license_expiry_date
                    ? new Date(guide.license_expiry_date).toLocaleDateString()
                    : ""}
                </td>
                <td
                  className="px-4 py-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onCertify(guide.guide_id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-2"
                    disabled={certifying === guide.guide_id}
                  >
                    {certifying === guide.guide_id ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                        Approving...
                      </>
                    ) : (
                      "Approve"
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}