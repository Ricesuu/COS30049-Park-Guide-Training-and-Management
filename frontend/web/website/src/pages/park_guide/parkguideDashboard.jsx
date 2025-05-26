// parkguideDashboard.jsx
import React, { useState, useEffect } from "react";
import "../../ParkGuideStyle.css";
import { auth } from "../../Firebase";
import { API_URL } from "../../config/apiConfig";

// Helper function that is used in the component
const formatDateString = (dateString) => {
  if (!dateString) return "Not available";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

const checkExpired = (dateString) => {
  if (!dateString) return false;
  const expiryDate = new Date(dateString);
  const now = new Date();
  return expiryDate < now;
};

const checkExpiringSoon = (dateString) => {
  if (!dateString) return false;
  const expiryDate = new Date(dateString);
  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);
  return expiryDate > now && expiryDate <= thirtyDaysFromNow;
};

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [guideData, setGuideData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modules, setModules] = useState([]);
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) {
          throw new Error("User not authenticated");
        }

        const token = await user.getIdToken();

        // Fetch user data
        const userResponse = await fetch(`${API_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await userResponse.json();
        setUserData(userData);

        // Get guide data
        const guideResponse = await fetch(`${API_URL}/api/park-guides/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!guideResponse.ok) {
          throw new Error("Failed to fetch guide data");
        }
        const guideData = await guideResponse.json();

        // If guide has an assigned park, fetch the park details
        if (
          guideData.assigned_park &&
          guideData.assigned_park !== "Unassigned"
        ) {
          const parkResponse = await fetch(
            `/api/parks/${guideData.assigned_park}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (parkResponse.ok) {
            const parkData = await parkResponse.json();
            guideData.assigned_park = parkData.park_name;
          }
        }

        setGuideData(guideData);

        // Get modules from guide training progress
        const modulesResponse = await fetch(
          "/api/guide-training-progress/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const modulesData = await modulesResponse.json();
        if (!modulesResponse.ok) {
          throw new Error(
            modulesData.error || "Failed to fetch training progress"
          );
        }

        // Transform the data to match the expected format
        let formattedModules = [];
        if (modulesData && modulesData.length > 0) {
          formattedModules = modulesData.map((module) => ({
            ...module,
            name: module.module_name,
            module_status: module.status,
            completion_percentage:
              module.status === "completed"
                ? 100
                : module.status === "in progress"
                ? 50
                : 0,
          }));
        }
        setModules(formattedModules);

        // Get certifications using guide_id
        const certsResponse = await fetch(
          `/api/certifications/user/${guideData.guide_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Handle certification response
        if (!certsResponse.ok) {
          // Don't throw error for 404 - just means no certifications yet
          if (certsResponse.status === 404) {
            setCertifications([]);
          } else {
            throw new Error("Failed to fetch certifications");
          }
        } else {
          const certsData = await certsResponse.json();
          setCertifications(
            certsData.map((cert) => ({
              ...cert,
              image_url: "/images/advanced_guide.png", // Default image
            }))
          );
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  // Helper functions are now moved to top of file

  const navigate = (path) => {
    window.location.href = path;
  };
  // Removed unused certImages array

  return (
    <div className="dashboard-main-content">
      <div className="page-title-card">
        <h1>Dashboard</h1>
        <p>
          Welcome to your park guide dashboard. Track your training progress and
          manage your certifications.
        </p>
      </div>
      {/* User Info Container */}{" "}
      <div className="user-info-card">
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "#64748b",
              fontSize: "1.1rem",
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
            }}
          >
            Loading user information...
          </div>
        ) : error ? (
          <div className="error-message">
            Error loading user information: {error}
          </div>
        ) : (
          <div className="user-details">
            <h2 className="user-name">
              {userData
                ? `${userData.first_name} ${userData.last_name}`
                : "User Name Not Available"}
            </h2>{" "}
            <div className="user-info-grid">
              <div className="user-info-item">
                <span className="info-label">Guide ID:</span>
                <span className="info-value">
                  {guideData?.guide_id || "Not Available"}
                </span>
              </div>{" "}
              <div className="user-info-item">
                <span className="info-label">Park:</span>
                <span className="info-value">
                  {guideData?.certification_status?.toLowerCase() ===
                  "not applicable"
                    ? "None"
                    : guideData?.assigned_park || "Unassigned"}
                </span>
              </div>{" "}
              <div className="user-info-item">
                <span className="info-label">License Status:</span>
                <span
                  className={`info-value status-${
                    guideData?.certification_status?.toLowerCase() || "pending"
                  }`}
                >
                  {guideData?.certification_status
                    ? guideData.certification_status
                        .split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )
                        .join(" ")
                    : "No License"}
                </span>
              </div>
              {guideData?.certification_status?.toLowerCase() !==
                "not applicable" &&
                guideData?.license_expiry_date && (
                  <div className="user-info-item">
                    <span className="info-label">License Expiry:</span>
                    <span className="info-value">
                      {new Date(
                        guideData.license_expiry_date
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              {userData && (
                <div className="user-info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{userData.email}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Only show content if there's no loading and no errors */}
      {!loading && !error && (
        <div className="centered-boxes">
          {/* Modules Container */}
          <div className="box module-container">
            <h2 className="boxtitle">Your Training Modules</h2>
            {modules && modules.length > 0 ? (
              <div className="modules-list">
                {" "}
                {modules.map((module, index) => (
                  <div
                    className="module-item"
                    key={index}
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "12px",
                      padding: "2rem",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      border: "1px solid rgba(124, 194, 66, 0.2)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "4px",
                        height: "100%",
                        background:
                          module.module_status === "completed"
                            ? "#4CAF50"
                            : module.module_status === "in progress"
                            ? "#FF9800"
                            : "#2E7D32",
                      }}
                    />
                    <div
                      className="module-content"
                      style={{ marginLeft: "1rem" }}
                    >
                      <h3
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "700",
                          color: "#2c3e50",
                          marginBottom: "1rem",
                          borderBottom: "2px solid rgba(124, 194, 66, 0.2)",
                          paddingBottom: "0.5rem",
                        }}
                      >
                        {module.name}
                      </h3>
                      <p
                        style={{
                          color: "#64748b",
                          fontSize: "1rem",
                          marginBottom: "1.5rem",
                          lineHeight: "1.5",
                        }}
                      >
                        {module.description}
                      </p>
                      <div
                        className="module-status"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: "auto",
                        }}
                      >
                        <span
                          className={`status-${
                            module.module_status?.toLowerCase() || "not-started"
                          }`}
                        >
                          <strong>Status:</strong>{" "}
                          {module.module_status || "Not Started"}
                        </span>
                        {module.completion_percentage && (
                          <div className="progress-bar">
                            <div
                              className="progress"
                              style={{
                                width: `${module.completion_percentage}%`,
                              }}
                            ></div>
                            <span>
                              {module.completion_percentage}% Complete
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-modules-message">
                <p>You don't have any training modules yet.</p>
              </div>
            )}{" "}
          </div>

          {/* Certification Section */}
          <div className="box certification">
            <h2 className="boxtitle">Your Certifications</h2>
            {certifications && certifications.length > 0 ? (
              <div className="certification-grid">
                {certifications.map((cert, index) => (
                  <div
                    key={cert.cert_id || index}
                    onClick={() => navigate("/park_guide/certifications")}
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "12px",
                      padding: "2.5rem 1.5rem 1.5rem",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      border: "1px solid rgba(124, 194, 66, 0.2)",
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                      minHeight: "200px",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 24px rgba(0,0,0,0.12)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 2px 4px rgba(0,0,0,0.1)";
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                        padding: "0.5rem 1rem",
                        borderRadius: "20px",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        backgroundColor: checkExpired(cert.expiry_date)
                          ? "#FEE2E2"
                          : checkExpiringSoon(cert.expiry_date)
                          ? "#FEF3C7"
                          : "#DCFCE7",
                        color: checkExpired(cert.expiry_date)
                          ? "#DC2626"
                          : checkExpiringSoon(cert.expiry_date)
                          ? "#D97706"
                          : "#059669",
                      }}
                    >
                      {checkExpired(cert.expiry_date)
                        ? "Expired"
                        : checkExpiringSoon(cert.expiry_date)
                        ? "Expiring Soon"
                        : "Active"}
                    </div>
                    <h3
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "600",
                        color: "#2c3e50",
                        marginTop: "0.5rem",
                      }}
                    >
                      {cert.module_name || "Untitled Certificate"}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        marginTop: "auto",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.95rem",
                          color: "#64748b",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "500",
                          }}
                        >
                          Issued:
                        </span>
                        {formatDateString(cert.issued_date)}
                      </p>
                      <p
                        style={{
                          fontSize: "0.95rem",
                          color: checkExpired(cert.expiry_date)
                            ? "#DC2626"
                            : "#64748b",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "500",
                          }}
                        >
                          Expires:
                        </span>
                        {formatDateString(cert.expiry_date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-certs-message">
                <p>Complete training modules to earn certifications</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
