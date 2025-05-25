import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../ParkGuideStyle.css";
import { auth } from "../../Firebase";

const ParkguideTraining = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [purchasedModules, setPurchasedModules] = useState([]);
    const [completedModules, setCompletedModules] = useState([]);
    const [ongoingModules, setOngoingModules] = useState([]);    const [availableModules, setAvailableModules] = useState([]);
    const [activeView, setActiveView] = useState('ongoing');
    const [hasAllCompulsoryModules, setHasAllCompulsoryModules] = useState(false);
    const [missingCompulsoryModules, setMissingCompulsoryModules] = useState([]);    const [token, setToken] = useState(null);

    // Get query params to check if we need to refresh data
    const queryParams = new URLSearchParams(location.search);
    const hasRefresh = queryParams.has("refresh");

    useEffect(() => {
        const checkAndGetToken = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    navigate('/login');
                    return null;
                }
                
                // Always get a fresh token
                const newToken = await user.getIdToken(true); // Force token refresh
                setToken(newToken);
                return newToken;
            } catch (error) {
                console.error('Authentication error:', error);
                navigate('/login');
                return null;
            }
        };

        const fetchModuleData = async () => {
            try {
                setLoading(true);
                
                const currentToken = await checkAndGetToken();
                if (!currentToken) return;
                
                // Fetch user's purchased modules
                const modulesResponse = await fetch("/api/training-modules/user", {
                    headers: {
                        Authorization: `Bearer ${currentToken}`,
                    },
                });

                let purchasedModulesData = [];
                if (modulesResponse.ok) {
                    purchasedModulesData = await modulesResponse.json();
                    console.log("User modules received:", purchasedModulesData);
                    
                    // Get user's guide_id
                    const guideResponse = await fetch('/api/park-guides/user', {
                        headers: {
                            'Authorization': `Bearer ${currentToken}`
                        }
                    });

                    if (!guideResponse.ok) {
                        throw new Error('Failed to fetch guide information');
                    }

                    const guideData = await guideResponse.json();
                    
                    // Fetch certifications
                    const certsResponse = await fetch(`/api/certifications/user/${guideData.guide_id}`, {
                        headers: {
                            'Authorization': `Bearer ${currentToken}`
                        }
                    });

                    let certifications = [];
                    if (certsResponse.ok) {
                        certifications = await certsResponse.json();
                    }
                    
                    // Mark modules with certifications as completed
                    const updatedPurchasedModules = purchasedModulesData.map(module => {
                        const hasCertification = certifications.some(cert => 
                            cert.module_id === module.id || cert.module_id === module.module_id
                        );
                        return {
                            ...module,
                            module_status: hasCertification ? "completed" : module.module_status || "not started",
                            status: hasCertification ? "completed" : module.status || "not started"
                        };
                    });
                    
                    // Split modules into completed and ongoing
                    const completed = updatedPurchasedModules.filter(module =>
                        module.module_status === "completed" || module.status === "completed"
                    );
                    
                    const ongoing = updatedPurchasedModules.filter(module =>
                        module.module_status !== "completed" && module.status !== "completed"
                    );
                    
                    setCompletedModules(completed);
                    setOngoingModules(ongoing);
                    setPurchasedModules(updatedPurchasedModules);

                    // Fetch available modules for purchase
                    const availableModulesResponse = await fetch("/api/training-modules/available", {
                        headers: {
                            Authorization: `Bearer ${currentToken}`,
                        },
                    });

                    if (availableModulesResponse.ok) {
                        const availableModulesData = await availableModulesResponse.json();
                        console.log("Available modules received:", availableModulesData);

                        // Find all compulsory modules
                        const compulsoryModules = availableModulesData.filter(
                            (module) => module.is_compulsory
                        );
                        const purchasedCompulsoryModules = compulsoryModules.filter(
                            (module) =>
                                purchasedModulesData.some(
                                    (purchased) => purchased.id === module.id
                                )
                        );

                        // Set compulsory module states
                        const missingModules = compulsoryModules.filter(
                            (module) =>
                                !purchasedModulesData.some(
                                    (purchased) => purchased.id === module.id
                                )
                        );
                        setMissingCompulsoryModules(missingModules);
                        setHasAllCompulsoryModules(
                            purchasedCompulsoryModules.length === compulsoryModules.length
                        );

                        // Filter out modules that are already purchased
                        const notPurchasedModules = availableModulesData.filter(
                            (module) =>
                                !purchasedModulesData.some(
                                    (purchased) => purchased.id === module.id
                                )
                        );

                        setAvailableModules(notPurchasedModules || []);
                    } else {
                        console.error("Failed to fetch available modules");
                    }
                } else {
                    console.error("Failed to fetch user modules");
                }
                
                setError(null);
            } catch (err) {
                console.error("Error fetching module data:", err);
                if (err.message.includes('authentication')) {
                    localStorage.removeItem('authToken');
                    setToken(null);
                    navigate('/login');
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        // Fetch data when component mounts or when returning from purchase page
        if (hasRefresh || !purchasedModules.length) {
            fetchModuleData();
        }
    }, [location.search, hasRefresh, purchasedModules.length, token, navigate]);

    const startTraining = (moduleId, event) => {
        // Prevent the event from bubbling up to parent elements
        if (event) {
            event.stopPropagation();
        }
        navigate(`/park_guide/module?moduleId=${moduleId}`);
    };

    const purchaseModule = (moduleId, event, isCompulsory) => {
        if (event) {
            event.stopPropagation();
        }

        // Prevent purchase of non-compulsory modules if compulsory ones are not completed
        if (!isCompulsory && !hasAllCompulsoryModules) {
            const missingModuleNames = missingCompulsoryModules
                .map((m) => m.name || m.module_name)
                .join(", ");
            alert(
                `You must complete the following compulsory modules first:\n${missingModuleNames}`
            );
            return;
        }

        if (!moduleId) {
            console.error("No module ID provided to purchaseModule function");
            return;
        }

        navigate(`/modules/purchase/${moduleId}`);
    };

    const renderModuleCard = (module, isPurchased = false) => {
        const status = module.module_status || module.status;        const bgColor = isPurchased
            ? status === "completed"
                ? "#4CAF50"
                : status === "in progress"
                    ? "#FF9800"
                    : "#2E7D32"
            : module.is_compulsory
                ? "#dc3545"
                : "#2E7D32";

        const isFree = module.price === 0 || module.price === "0" || module.price === "0.00";

        return (
            <div
                className={isPurchased ? "training-module-card" : "store-module-card"}
                style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    cursor: "pointer",
                    backgroundColor: "#fff",
                    opacity: !isPurchased && !module.is_compulsory && !hasAllCompulsoryModules ? 0.7 : 1,
                }}
                onClick={(e) =>
                    isPurchased
                        ? startTraining(module.id || module.module_id, e)
                        : purchaseModule(module.module_id || module.id, e, module.is_compulsory)
                }
                onMouseOver={(e) => {
                    if (isPurchased || module.is_compulsory || hasAllCompulsoryModules) {
                        e.currentTarget.style.transform = "translateY(-5px)";
                        e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
                    }
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                }}
            >
                <div
                    style={{
                        backgroundColor: bgColor,
                        padding: "16px",
                        color: "white",
                    }}
                >
                    {module.is_compulsory && !isPurchased && (
                        <div style={{ fontWeight: "bold", marginBottom: "8px" }}>Required Module</div>
                    )}                {!isPurchased && (
                        <div
                            style={{
                                display: "inline-block",
                                padding: "4px 8px",
                                backgroundColor: isFree ? "#4CAF50" : "#2E7D32",
                                borderRadius: "4px",
                                fontSize: "14px",
                                fontWeight: "bold",
                            }}
                        >
                            {isFree ? "FREE" : `RM ${parseFloat(module.price).toFixed(2)}`}
                        </div>
                    )}
                </div>

                <div style={{ padding: "16px" }}>
                    <h3 style={{ margin: "0 0 8px 0" }}>
                        {module.name || module.module_name}
                    </h3>
                    <p
                        style={{
                            margin: "0 0 16px 0",
                            fontSize: "14px",
                            color: "#666",
                        }}
                    >
                        {module.description || "No description available."}
                    </p>

                    {isPurchased && module.completion_percentage !== undefined && (
                        <div
                            className="progress-bar"
                            style={{
                                height: "8px",
                                backgroundColor: "#f0f0f0",
                                borderRadius: "4px",
                                marginBottom: "12px",
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    width: `${module.completion_percentage}%`,
                                    height: "100%",
                                    backgroundColor: "#4CAF50",
                                    borderRadius: "4px",
                                }}
                            />
                            <p style={{ fontSize: "12px", textAlign: "center", marginTop: "4px" }}>
                                {module.completion_percentage}% Complete
                            </p>
                        </div>
                    )}                    <div style={{ marginTop: "16px" }}>
                        {module.difficulty && (
                            <div style={{ marginBottom: "12px", fontWeight: "bold", color: "#555" }}>
                                Difficulty: {module.difficulty}
                            </div>
                        )}
                        <button
                            onClick={(e) =>
                                isPurchased
                                    ? startTraining(module.id || module.module_id, e)
                                    : purchaseModule(module.module_id || module.id, e, module.is_compulsory)
                            }
                            disabled={!isPurchased && !module.is_compulsory && !hasAllCompulsoryModules}
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                backgroundColor: !isPurchased && !module.is_compulsory && !hasAllCompulsoryModules
                                    ? "#ccc"
                                    : bgColor,
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: !isPurchased && !module.is_compulsory && !hasAllCompulsoryModules
                                    ? "not-allowed"
                                    : "pointer",
                                fontWeight: "600",
                                fontSize: "14px",
                                transition: "all 0.2s ease-in-out",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            }}
                        >                            
                        {isPurchased
                                ? status === "completed"
                                    ? "Review Module"
                                    : status === "in progress"
                                        ? "Continue Module"
                                        : "Start Module"
                                : !module.is_compulsory && !hasAllCompulsoryModules
                                    ? "Complete Required Modules First"
                                    : isFree
                                        ? "Enroll Now" 
                                        : "Purchase"}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="training-main-content">
            <div className="page-title-card">
                <h1>Training Modules</h1>
                <p>
                    Welcome to the Park Guide Training Program. These modules
                    are designed to enhance your skills and knowledge as a
                    professional park guide.
                </p>
            </div>

            <div className="training-header">                <div className="module-view-toggle" style={{ display: 'flex', gap: '1px' }}>
                    <button
                        onClick={() => setActiveView('ongoing')}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: activeView === 'ongoing' ? "#2E7D32" : "#f0f0f0",
                            color: activeView === 'ongoing' ? "white" : "#333",
                            border: "none",
                            borderRadius: "4px 0 0 4px",
                            cursor: "pointer",
                            flex: 1,
                        }}
                    >
                        Ongoing Modules
                    </button>
                    <button
                        onClick={() => setActiveView('completed')}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: activeView === 'completed' ? "#2E7D32" : "#f0f0f0",
                            color: activeView === 'completed' ? "white" : "#333",
                            border: "none",
                            borderRadius: "0",
                            cursor: "pointer",
                            flex: 1,
                        }}
                    >
                        Completed Modules
                    </button>
                    <button
                        onClick={() => setActiveView('available')}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: activeView === 'available' ? "#2E7D32" : "#f0f0f0",
                            color: activeView === 'available' ? "white" : "#333",
                            border: "none",
                            borderRadius: "0 4px 4px 0",
                            cursor: "pointer",
                            flex: 1,
                        }}
                    >
                        Available Modules
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "2rem" }}>
                    <p>Loading modules...</p>
                </div>
            ) : error ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>
                    <p>Error: {error}</p>
                </div>
            ) : (
                <>            {activeView === 'available' ? (                <div className="training-module-store" style={{ marginTop: "2rem" }}>
                            {!hasAllCompulsoryModules && (
                                <div
                                    style={{
                                        backgroundColor: "#fff3cd",
                                        border: "1px solid #ffeeba",
                                        color: "#856404",
                                        padding: "1rem",
                                        marginBottom: "1rem",
                                        borderRadius: "4px",
                                    }}
                                >
                                    <h3 style={{ marginBottom: "0.5rem", fontWeight: "bold" }}>
                                        Complete Required Modules First
                                    </h3>
                                    <p>
                                        Please complete these compulsory modules
                                        before purchasing additional modules:
                                    </p>
                                    <ul
                                        style={{
                                            marginTop: "0.5rem",
                                            marginLeft: "1.5rem",
                                            listStyle: "disc",
                                        }}
                                    >
                                        {missingCompulsoryModules.map((module, index) => (
                                            <li key={index}>
                                                {module.name || module.module_name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {availableModules.length === 0 ? (
                                <p
                                    style={{
                                        textAlign: "center",
                                        padding: "2rem",
                                        backgroundColor: "#f9f9f9",
                                        borderRadius: "8px",
                                    }}
                                >
                                    No additional modules available at this time.
                                </p>
                            ) : (
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                                        gap: "20px",
                                    }}
                                >
                                    {availableModules.map(module => renderModuleCard(module))}
                                </div>
                            )}
                        </div>                    ) : activeView === 'completed' ? (                        <div className="training-module-grid" style={{ marginTop: "2rem" }}>
                            {completedModules.length === 0 ? (
                                <div
                                    style={{
                                        textAlign: 'center',
                                        padding: '2rem',
                                        backgroundColor: '#f9f9f9',
                                        borderRadius: '8px',
                                    }}
                                >
                                    <p style={{ marginBottom: '15px', fontSize: '16px' }}>
                                        You haven't completed any modules yet.
                                    </p>
                                    <button
                                        onClick={() => setActiveView('ongoing')}
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: '#2E7D32',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            marginTop: '12px',
                                        }}
                                    >
                                        View Ongoing Modules
                                    </button>
                                </div>
                            ) : (
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                        gap: '20px',
                                    }}
                                >
                                    {completedModules.map(module => renderModuleCard(module, true))}
                                </div>
                            )}
                        </div>
                    ) : (                        <div className="training-module-grid" style={{ marginTop: "2rem" }}>
                            {ongoingModules.length === 0 ? (
                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: "2rem",
                                        backgroundColor: "#f9f9f9",
                                        borderRadius: "8px",
                                    }}
                                >
                                    <p style={{ marginBottom: "15px", fontSize: "16px" }}>
                                        You haven't enrolled in any modules yet.
                                    </p>                                    <button
                                        onClick={() => setActiveView('available')}
                                        style={{
                                            padding: "10px 20px",
                                            backgroundColor: "#4CAF50",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            marginTop: "12px",
                                        }}
                                    >
                                        Browse Available Modules
                                    </button>
                                </div>
                            ) : (                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                                        gap: "20px",
                                    }}
                                >
                                    {ongoingModules.map(module => renderModuleCard(module, true))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ParkguideTraining;
