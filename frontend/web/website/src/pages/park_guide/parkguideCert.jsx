import React, { useState, useEffect } from "react";
import "../../ParkGuideStyle.css";
import "../../CertificationStyle.css";
import { auth } from "../../Firebase";
import { API_URL } from "../../config/apiConfig";

const formatDate = (dateString) => {
  if (!dateString) return "Not available";
  try {
    // Parse the date and handle timezone
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";

    // Get the current date for relative date calculations
    const now = new Date();
    const diffTime = Math.abs(date - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Display relative dates for recent or upcoming dates
    if (diffDays <= 7) {
      if (date > now) {
        return `Expires in ${diffDays} days`;
      } else {
        return diffDays === 0 ? "Today" : `${diffDays} days ago`;
      }
    }

    // For other dates, use a standard format
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Use local timezone
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

const ParkguideCert = () => {
  const [selectedCert, setSelectedCert] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [certifications, setCertifications] = useState([]);
  const [isEligibleForLicense, setIsEligibleForLicense] = useState(false);
  const [parkGuideInfo, setParkGuideInfo] = useState(null);
  const [parks, setParks] = useState([]);
  const [selectedPark, setSelectedPark] = useState("");
  const [showParkModal, setShowParkModal] = useState(false);

  // Check if the guide is eligible for official license
  const checkLicenseEligibility = (guideInfo, certifications) => {
    console.log("Checking license eligibility with data:", {
      guideInfo: guideInfo,
      certificationsCount: certifications?.length,
      certifications: certifications,
    });

    if (!guideInfo) {
      console.log("No guide info available");
      return false;
    }

    const status = guideInfo.certification_status?.toLowerCase();
    console.log("Current certification status:", status);

    // Only proceed if status is 'not applicable'
    if (status !== "not applicable") {
      console.log("Guide not eligible - wrong status:", status);
      return false;
    }

    if (!certifications || !Array.isArray(certifications)) {
      console.log("No valid certifications data");
      return false;
    }

    // Get all compulsory module certifications
    const compulsoryCerts = certifications.filter((cert) => {
      console.log("Checking cert:", cert);
      return cert.is_compulsory === true;
    });

    console.log("Compulsory certs found:", {
      count: compulsoryCerts.length,
      certs: compulsoryCerts,
    });

    // Only eligible if they have completed both compulsory modules
    const isEligible = compulsoryCerts.length >= 2;
    console.log("Final eligibility result:", isEligible);

    return isEligible;
  };

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) {
          throw new Error("User not authenticated");
        }

        const token = await user.getIdToken();

        // Get guide_id first
        const guideResponse = await fetch(`${API_URL}/api/park-guides/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!guideResponse.ok) {
          throw new Error("Failed to fetch guide information");
        }

        const guideData = await guideResponse.json();
        setParkGuideInfo(guideData);

        // Get all modules to check which ones are compulsory
        const modulesResponse = await fetch("/api/training-modules/available", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!modulesResponse.ok) {
          throw new Error("Failed to fetch module information");
        }

        const modulesData = await modulesResponse.json();
        const compulsoryModuleIds = new Set(
          modulesData.filter((m) => m.is_compulsory).map((m) => m.id)
        );

        // Now fetch certifications using guide_id
        const certsResponse = await fetch(
          `/api/certifications/user/${guideData.guide_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!certsResponse.ok) {
          throw new Error("Failed to fetch certifications");
        }

        const certsData = await certsResponse.json();
        // Augment certifications with module information
        const certsWithModuleInfo = certsData.map((cert) => ({
          ...cert,
          is_compulsory: compulsoryModuleIds.has(cert.module_id),
        }));
        setCertifications(certsWithModuleInfo);

        // Check license eligibility
        if (guideData && certsWithModuleInfo) {
          const isEligible = checkLicenseEligibility(
            guideData,
            certsWithModuleInfo
          );
          setIsEligibleForLicense(isEligible);
        }
      } catch (err) {
        console.error("Error fetching certifications:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  const handleCertificationClick = (cert) => {
    setSelectedCert(cert);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedCert(null);
  };

  // Park selection modal
  const ParkSelectionModal = () => (
    <div
      className="cert-popup-overlay"
      onClick={() => setShowParkModal(false)}
      style={{ zIndex: 1000 }}
    >
      <div
        className="cert-popup"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "90%",
          maxWidth: "500px",
          padding: "2rem",
        }}
      >
        <h3
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1.5rem",
            color: "#111827",
          }}
        >
          Select Park for Assignment
        </h3>
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ color: "#4b5563", marginBottom: "1rem" }}>
            Choose a park where you would like to be assigned. Your request will
            be reviewed by an administrator.
          </p>
          <select
            value={selectedPark}
            onChange={(e) => setSelectedPark(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #e5e7eb",
              backgroundColor: "#ffffff",
              color: "#111827",
              cursor: "pointer",
              fontSize: "1rem",
              outline: "none",
            }}
          >
            <option value="">Select a park...</option>{" "}
            {parks.map((park) => (
              <option key={park.park_id} value={park.park_id}>
                {park.park_name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={() => setShowParkModal(false)}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #e5e7eb",
              backgroundColor: "#f3f4f6",
              color: "#374151",
              fontWeight: "500",
              flex: 1,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleLicenseApplication}
            disabled={!selectedPark}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              border: "none",
              backgroundColor: selectedPark ? "#047857" : "#9ca3af",
              color: "white",
              fontWeight: "600",
              flex: 1,
              cursor: selectedPark ? "pointer" : "not-allowed",
            }}
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );

  const fetchParks = async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(`${API_URL}/api/parks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch parks");
      const data = await response.json();
      setParks(data);
    } catch (err) {
      console.error("Error fetching parks:", err);
      setError("Failed to load available parks. Please try again.");
    }
  };

  const handleLicenseApplication = async () => {
    if (!selectedPark || !parkGuideInfo?.guide_id) return;

    try {
      // Log the data being sent for debugging
      const parkId = parseInt(selectedPark, 10);
      if (isNaN(parkId)) {
        throw new Error("Invalid park ID selected");
      }

      console.log("Submitting license application with:", {
        guide_id: parkGuideInfo.guide_id,
        requested_park_id: parkId,
      });

      const token = await auth.currentUser.getIdToken();
      const response = await fetch(
        "/api/park-guides/license-approval-request",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            guide_id: parseInt(parkGuideInfo.guide_id, 10),
            requested_park_id: parkId,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit license request");
      }

      // Close the park selection modal
      setShowParkModal(false);

      // Show success message
      alert(
        "Your license application has been submitted successfully! An administrator will review your request."
      );

      // Refresh certifications and guide info
      const updatedGuideResponse = await fetch(
        `${API_URL}/api/park-guides/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (updatedGuideResponse.ok) {
        const updatedGuideData = await updatedGuideResponse.json();
        setParkGuideInfo(updatedGuideData);
        setIsEligibleForLicense(false); // No longer eligible since request is pending
      }
    } catch (err) {
      console.error("Error submitting license request:", err);
      setError("Failed to submit license request. Please try again.");
    }
  };

  return (
    <div className="cert-main-content">
      <div className="page-title-card">
        <h1>Certification & Licensing</h1>
        <p>
          View and manage your professional park guide certifications. Complete
          training modules to earn new certifications.
        </p>
      </div>

      {isEligibleForLicense && (
        <div
          style={{
            backgroundColor: "#d1e7dd",
            color: "#0f5132",
            padding: "1.5rem",
            borderRadius: "8px",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            🎉 Congratulations! You are now eligible for an official park guide
            license.
          </h3>
          <p style={{ marginBottom: "1rem" }}>
            You have completed all required training modules. You can now
            proceed to apply for your park guide license.
          </p>
          <button
            onClick={() => {
              setShowParkModal(true);
              fetchParks();
            }}
            style={{
              backgroundColor: "#047857",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              border: "none",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#065f46")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#047857")}
          >
            Apply for License
          </button>
        </div>
      )}

      {loading && (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            backgroundColor: "#f9fafb",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
          }}
        >
          <p style={{ fontSize: "1.1rem", color: "#64748b" }}>
            Loading certifications...
          </p>
        </div>
      )}

      {error && (
        <div
          className="error-message"
          style={{
            textAlign: "center",
            padding: "1rem",
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            borderRadius: "8px",
            margin: "1rem 0",
          }}
        >
          {error}
        </div>
      )}

      {!loading && certifications.length === 0 && (
        <div
          className="no-certs-message"
          style={{
            textAlign: "center",
            padding: "3rem",
            backgroundColor: "#f9fafb",
            borderRadius: "12px",
            border: "2px dashed #d1d5db",
          }}
        >
          <h3 style={{ color: "#374151", marginBottom: "1rem" }}>
            No Certifications Yet
          </h3>
          <p style={{ color: "#6b7280" }}>
            Complete training modules to earn your certifications
          </p>
        </div>
      )}

      {certifications.length > 0 && (
        <div className="cert-page-grid">
          {certifications.map((cert, index) => (
            <div
              key={cert.cert_id || index}
              className="cert-page-box"
              onClick={() => handleCertificationClick(cert)}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "1px solid #e5e7eb",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {" "}
              <div className="cert-title-container">
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                  }}
                >
                  {cert.module_name || "Untitled Certificate"}
                </h3>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: "#6b7280",
                      fontSize: "0.875rem",
                    }}
                  >
                    Issued
                  </span>
                  <span
                    style={{
                      color: "#111827",
                      fontWeight: "500",
                    }}
                  >
                    {formatDate(cert.issued_date)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: "#6b7280",
                      fontSize: "0.875rem",
                    }}
                  >
                    Expires
                  </span>
                  <span
                    style={{
                      color: "#111827",
                      fontWeight: "500",
                    }}
                  >
                    {formatDate(cert.expiry_date)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showPopup && selectedCert && (
        <div className="cert-popup-overlay" onClick={closePopup}>
          <div className="cert-popup" onClick={(e) => e.stopPropagation()}>
            {" "}
            <div className="cert-popup-header">
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                }}
              >
                {selectedCert.module_name || "Certificate"}
              </h3>
              <p style={{ fontSize: "0.875rem", opacity: 0.9 }}>
                Professional Park Guide Certification
              </p>
            </div>
            <div className="cert-popup-content">
              <div
                style={{
                  display: "grid",
                  gap: "1.5rem",
                  marginBottom: "2rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "1rem",
                    backgroundColor: "#f9fafb",
                    borderRadius: "8px",
                  }}
                >
                  <span
                    style={{
                      color: "#374151",
                      fontWeight: "500",
                    }}
                  >
                    Issued Date
                  </span>
                  <span style={{ color: "#111827" }}>
                    {formatDate(selectedCert.issued_date)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "1rem",
                    backgroundColor: "#f9fafb",
                    borderRadius: "8px",
                  }}
                >
                  <span
                    style={{
                      color: "#374151",
                      fontWeight: "500",
                    }}
                  >
                    Expiry Date
                  </span>
                  <span style={{ color: "#111827" }}>
                    {formatDate(selectedCert.expiry_date)}
                  </span>
                </div>
              </div>
              <div style={{ marginBottom: "2rem" }}>
                <h4
                  style={{
                    color: "#111827",
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    marginBottom: "1rem",
                  }}
                >
                  Description
                </h4>
                <p
                  style={{
                    color: "#4b5563",
                    lineHeight: "1.6",
                  }}
                >
                  {selectedCert.description ||
                    "This certificate verifies successful completion of the training module and demonstrates your expertise as a professional park guide."}
                </p>
              </div>{" "}
              <div className="cert-popup-footer">
                <button
                  onClick={closePopup}
                  className="cert-action-button"
                  style={{
                    backgroundColor: "#f3f4f6",
                    color: "#374151",
                    width: "100%",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showParkModal && <ParkSelectionModal />}
    </div>
  );
};

export default ParkguideCert;
