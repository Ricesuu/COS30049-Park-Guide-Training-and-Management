import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { API_URL } from '../constants/constants';

const TrainingModule = () => {
    const router = useRouter();
    const { id } = router.query; // Get module ID from query parameters
    
    const [module, setModule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);

    useEffect(() => {
        // Only fetch module data when ID is available (after router is ready)
        if (id) {
            fetchModuleData();
        }
    }, [id]);

    const fetchModuleData = async () => {
        try {
            setLoading(true);
            // Get the user token from localStorage
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('User not authenticated');
            }            // Fetch module details from the API
            const response = await fetch(`${API_URL}/api/training-modules/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch module details');
            }

            const data = await response.json();
            console.log('Fetched module details:', data);
            setModule(data);
            
            // Set initial progress
            if (data.completion_percentage) {
                setProgress(data.completion_percentage);
            }
        } catch (err) {
            console.error('Error fetching module details:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const navigateTo = (page) => {
        router.push(page);
    };

    // Update progress as user advances through the module (simple simulation)
    const updateProgress = async (newProgress) => {
        try {
            setProgress(newProgress);
            
            // In a real implementation, you would send this progress to the backend
            // This would be where you call an API to update the module progress
            console.log(`Progress updated to: ${newProgress}%`);
            
            // If progress is 100%, mark quiz as completed
            if (newProgress >= 100) {
                setQuizCompleted(true);
            }
        } catch (err) {
            console.error('Failed to update progress:', err);
        }
    };

    // Handle completing the module
    const handleCompleteModule = () => {
        // Update progress to 100%
        updateProgress(100);
        
        // Redirect back to training page after a delay
        setTimeout(() => {
            router.push('/parkguideTraining');
        }, 2000);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="sidebar flex flex-col justify-start items-center w-72 p-5 bg-gray-200">
                <img src="/images/SFC_LOGO_small.jpg" alt="SFC Logo" className="w-1/2 mb-6" />
                <button className="btn w-4/5 bg-white text-center py-2 mb-3 rounded shadow" onClick={() => navigateTo('/parkguideDashboard')}>
                    Dashboard
                </button>
                <button className="btn w-4/5 bg-white text-center py-2 mb-3 rounded shadow" onClick={() => navigateTo('/parkguideTraining')}>
                    Training Module
                </button>
                <button className="btn w-4/5 bg-white text-center py-2 mb-3 rounded shadow" onClick={() => navigateTo('/parkguideCert')}>
                    Certification & Licensing
                </button>
                <button className="btn w-4/5 bg-white text-center py-2 mb-3 rounded shadow" onClick={() => navigateTo('/parkguideIdentifier')}>
                    Identifier
                </button>
                <button className="btn w-4/5 bg-white text-center py-2 mb-3 rounded shadow" onClick={() => navigateTo('/parkguideMonitoring')}>
                    Monitoring
                </button>
                <button className="btn w-4/5 bg-white text-center py-2 mb-3 rounded shadow" onClick={() => navigateTo('/parkguidePerformance')}>
                    Performance
                </button>
                <button className="btn w-4/5 bg-white text-center py-2 mb-3 rounded shadow" onClick={() => navigateTo('/parkguidePlantInfo')}>
                    Plant Info
                </button>
                <button className="btn w-4/5 bg-red-500 text-white text-center py-2 mb-3 rounded shadow" onClick={() => navigateTo('/logout')}>
                    Logout
                </button>
            </div>
            
            {/* Main Content */}
            <div className="main-content flex flex-grow">
                {loading ? (
                    <div className="flex justify-center items-center w-full">
                        <p className="text-lg text-gray-600">Loading module content...</p>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center w-full">
                        <p className="text-lg text-red-500">Error: {error}</p>
                    </div>
                ) : !module ? (
                    <div className="flex justify-center items-center w-full">
                        <p className="text-lg text-gray-600">Module not found</p>
                    </div>
                ) : (
                    <>
                        {/* Left Column */}
                        <div className="left-column flex flex-col flex-grow-3">
                            <div className="module-header bg-white p-4 m-2 rounded shadow">
                                <h1 className="text-xl font-bold mb-2">{module.module_name}</h1>
                                {/* Progress bar */}
                                <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                                    <div 
                                        className="bg-green-500 h-full rounded-full" 
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{progress}% Complete</p>
                            </div>
                            <div className="monitoringbox bg-white p-4 m-2 rounded shadow">
                                <iframe
                                    className="w-full h-[30rem] rounded shadow"
                                    src={module.videoUrl || "https://www.youtube.com/embed/fRhtivCmiKo?si=KM-JjMp7NELS1Ltw"}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    onPlay={() => updateProgress(25)} // Update progress when video starts playing
                                ></iframe>
                            </div>
                            <div className="box bg-white p-4 m-2 rounded shadow flex flex-col justify-start flex-grow">
                                <h2 className="text-lg font-bold mb-2">Description</h2>
                                <p>{module.description || "No description available."}</p>
                                <div className="mt-4">
                                    <h3 className="font-bold">Duration: </h3>
                                    <p>{module.duration || "N/A"} minutes</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="right-column bg-white p-4 m-2 rounded shadow flex flex-col overflow-y-auto">
                            <h2 className="text-lg font-bold mb-4 text-center">Transcript</h2>
                            {/* Transcript Section */}
                            <div className="flex flex-col space-y-4 flex-grow overflow-y-auto">
                                <div className="transcript bg-gray-100 p-3 rounded shadow">
                                    <p className="font-bold">Speaker 1</p>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque leo est, lobortis vitae bibendum imperdiet, convallis ut diam. In sit amet fringilla elit...</p>
                                </div>
                                <div className="transcript bg-gray-100 p-3 rounded shadow">
                                    <p className="font-bold">Speaker 2</p>
                                    <p>Curabitur fermentum sit amet mauris sit amet mattis. Cras id lacus finibus, egestas augue quis, consectetur dolor...</p>
                                </div>
                                {/* Add more transcript entries as needed */}
                            </div>
                            
                            {/* Next Page Button */}
                            <div className="flex justify-center mt-4">
                                <button
                                    className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600"
                                    onClick={() => {
                                        if (quizCompleted) {
                                            navigateTo('/parkguideTraining');
                                        } else {
                                            // Simulate completing half of the module
                                            updateProgress(50);
                                            // Open quiz modal or go to quiz page
                                            alert("Halfway through! Take a short quiz to continue.");
                                        }
                                    }}
                                >
                                    {quizCompleted ? "Return to Training Modules" : "Continue"}
                                </button>
                                
                                {progress >= 50 && !quizCompleted && (
                                    <button
                                        className="bg-green-500 text-white px-6 py-2 rounded shadow hover:bg-green-600 ml-4"
                                        onClick={handleCompleteModule}
                                    >
                                        Complete Module
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TrainingModule;