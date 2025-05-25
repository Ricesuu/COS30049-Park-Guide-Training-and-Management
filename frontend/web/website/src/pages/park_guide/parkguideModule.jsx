import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../ParkGuideStyle.css";
import "../../ModuleStyle.css";
import { auth } from "../../Firebase";

const ParkguideModule = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quizCompleted, setQuizCompleted] = useState(false);    const [module, setModule] = useState({
        title: "Loading...",
        description: "Loading module content...",
        video_url: null,
        course_content: null,
        quiz_id: null,
        completion_percentage: 0,
        status: null,
    });

    const queryParams = new URLSearchParams(location.search);
    const moduleId = queryParams.get("moduleId");

    useEffect(() => {
        const fetchModuleData = async () => {
            try {
                setLoading(true);
                const user = auth.currentUser;
                if (!user) {
                    throw new Error("User not authenticated");
                }

                const token = await user.getIdToken();

                // Fetch module data including course_content and video_url
                const response = await fetch(
                    `/api/training-modules/${moduleId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    if (response.status === 403) {
                        throw new Error(
                            errorData.error ||
                                "Access to this module is restricted"
                        );
                    }
                    throw new Error("Failed to fetch module data");
                }
                const moduleData = await response.json();
                
                // Create the module data with default values if needed
                const processedModuleData = {
                    title: moduleData.module_name,
                    description: moduleData.description,
                    video_url: moduleData.video_url,
                    course_content: moduleData.course_content,
                    quiz_id: moduleData.quiz_id,
                    completion_percentage: moduleData.completion_percentage || 0,
                    status: moduleData.status
                };

                // Check module completion status and quiz attempts
                const quizResponse = await fetch(
                    `/api/quizattempts?moduleId=${moduleId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (quizResponse.ok) {
                    const quizData = await quizResponse.json();
                    const hasPassedQuiz =
                        quizData && quizData.some((attempt) => attempt.passed);
                    setQuizCompleted(hasPassedQuiz);

                    // Update module status if quiz is passed
                    if (hasPassedQuiz) {
                        processedModuleData.status = "completed";
                    }
                }

                setModule(processedModuleData);
                setError(null);
            } catch (err) {
                console.error("Error fetching module:", err);
                setError(err.message);
                if (
                    err.message.includes("access") ||
                    err.message.includes("pending approval")
                ) {
                    navigate("/park_guide/training");
                }
            } finally {
                setLoading(false);
            }
        };

        if (moduleId) {
            fetchModuleData();
        } else {
            setError("No module ID provided");
            setLoading(false);
        }
    }, [moduleId, navigate]);

    const startQuiz = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error("User not authenticated");
            }

            if (quizCompleted || module.status === "completed") {
                // If quiz is already completed, don't start a new attempt
                navigate("/park_guide/cert");
                return;
            }

            const token = await user.getIdToken();

            // Check if quiz is available for this module
            const quizCheckResponse = await fetch(
                `/api/training-modules/${moduleId}/quiz`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!quizCheckResponse.ok) {
                throw new Error("Quiz is not available for this module");
            }

            // Navigate to quiz page
            navigate(`/park_guide/quiz?moduleId=${moduleId}`);
        } catch (err) {
            console.error("Error starting quiz:", err);
            setError(err.message);
        }
    };

    return (
        <div className="module-content">
            <div className="module-title">{module.title}</div>            {loading && (
                <div className="module-details" style={{ justifyContent: "center", alignItems: "center" }}>
                    <p style={{ fontSize: "1.1rem", color: "#64748b", textAlign: "center" }}>Loading module content...</p>
                </div>
            )}
            {error && <div className="error-message">{error}</div>}{!loading && !error && (
                <div className="module-details">

                    {module.video_url && (
                        <div className="video-section">
                            <h3>Course Video</h3>
                            <video controls src={module.video_url}>
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )}

                    {module.course_content && (
                        <div className="course-content">
                            <h3>Course Materials</h3>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: module.course_content,
                                }}
                            />
                        </div>
                    )}

                    <div className="module-actions">
                        {quizCompleted || module.status === "completed" ? (
                            <div className="module-completed">
                                <p className="success-message">
                                    <span>✓</span> Module Completed
                                </p>
                                <button
                                    className="view-cert-button"
                                    onClick={() =>
                                        navigate("/park_guide/certifications")
                                    }
                                >
                                    View Certificate
                                </button>
                            </div>
                        ) : (
                            <button
                                className="start-quiz-button"
                                onClick={startQuiz}
                            >
                                Start Quiz
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParkguideModule;
