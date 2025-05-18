import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { API_URL } from '../constants/constants';

const Training = () => {
    const router = useRouter();
    const [modules, setModules] = useState([]);
    const [availableModules, setAvailableModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAvailable, setShowAvailable] = useState(false);
    
    // Fetch user's purchased modules
    useEffect(() => {
        fetchUserModules();
        
        // Set up auto-refresh interval (every 30 seconds)
        const refreshInterval = setInterval(() => {
            // Only refresh user modules (not available modules) and do it silently
            const token = localStorage.getItem('token');
            if (token && !showAvailable) {
                console.log("Auto-refreshing modules...");
                fetchUserModules(true); // true for silent refresh
            }
        }, 30000);
        
        // Clean up interval on component unmount
        return () => clearInterval(refreshInterval);
    }, [showAvailable]);
    
    const fetchUserModules = async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            // Get the user token from localStorage
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('User not authenticated');
            }            // Fetch modules from the API
            const response = await fetch(`${API_URL}/api/training-modules/user`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch modules');
            }            const data = await response.json();
            console.log('Fetched modules:', data);
            
            // Process modules to handle different statuses
            const processedModules = data.map(module => ({
                ...module,
                // Use the statusDisplay from backend or fallback to calculating it
                statusText: module.statusDisplay || (module.paymentStatus === 'approved' ? 'Active' : 'Pending Approval'),
                // Only allow access to modules with approved payment status
                canAccess: module.isAccessible || module.paymentStatus === 'approved'
            }));
            
            setModules(processedModules);
            
            // Also fetch available modules for purchase
            fetchAvailableModules(token);
        } catch (err) {
            console.error('Error fetching modules:', err);
            setError(err.message);
        } finally {
            if (!silent) setLoading(false);
        }
    };
      // Fetch available modules for purchase
    const fetchAvailableModules = async (token) => {
        try {
            const response = await fetch(`${API_URL}/api/training-modules/available`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch available modules');
            }

            const data = await response.json();
            console.log('Available modules:', data);
            setAvailableModules(data);
        } catch (err) {
            console.error('Error fetching available modules:', err);
        }
    };const navigateTo = (page) => {
        router.push(page);
    };

    // Function to handle module purchase
    const handleModulePurchase = (moduleId, moduleName, price) => {
        // Navigate to payment page with module details
        router.push({
            pathname: '/modulePayment',
            query: { 
                moduleId: moduleId, 
                moduleName: moduleName, 
                price: price,
                returnTo: '/parkguideTraining'
            }
        });
    };    const startTraining = (moduleId, moduleName, completionPercentage, canAccess, statusText) => {
        if (completionPercentage === 100) {
            alert(`Module: ${moduleName}\nStatus: Completed`);
        } else if (!canAccess) {
            alert(`Module: ${moduleName}\nStatus: ${statusText}\nThis module is not yet available. Please wait for payment approval.`);
        } else {
            // Pass module id as query parameter
            router.push({
                pathname: '/parkguideModule',
                query: { id: moduleId }
            });
        }
    };

    // Function to get the appropriate status text
    const getStatusText = (percentage) => {
        if (percentage === 100) return "Completed";
        if (percentage > 0) return "In Progress";
        return "Not Started";
    };

    // Function to get a fallback image if none is provided
    const getModuleImage = (moduleId) => {
        if (moduleId % 5 === 0) return "/images/module5.png";
        if (moduleId % 4 === 0) return "/images/module4.png";
        if (moduleId % 3 === 0) return "/images/module3.png";
        if (moduleId % 2 === 0) return "/images/module2.png";
        return "/images/module1.png";
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


            {/* Main Content */}                <div className="main-content flex flex-grow p-4">
                <div className="bg-white p-6 rounded shadow w-full h-full">
                    <div className="flex justify-between items-center mb-4">                        <h2 className="text-lg font-bold text-center">Training Modules</h2>
                        <div className="flex space-x-2">
                            <button 
                                onClick={() => setShowAvailable(false)}
                                className={`px-3 py-1 rounded ${!showAvailable ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                            >
                                My Modules
                            </button>
                            <button 
                                onClick={() => setShowAvailable(true)}
                                className={`px-3 py-1 rounded ${showAvailable ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                            >
                                Available Modules
                            </button>                            <button 
                                onClick={() => {
                                    setLoading(true);
                                    const token = localStorage.getItem('token');
                                    if (token) {
                                        if (showAvailable) {
                                            fetchAvailableModules(token);
                                        } else {
                                            // Force a complete refresh with cache-busting
                                            console.log("Manual refresh initiated - fetching latest module data");
                                            fetchUserModules();
                                        }
                                    }
                                }}
                                className="px-3 py-1 rounded bg-blue-500 text-white"
                                title="Click to refresh module data including newly approved modules"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Check For Updates
                            </button>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <p className="text-lg text-gray-600">Loading modules...</p>
                        </div>
                    ) : error ? (
                        <div className="flex justify-center items-center h-64">
                            <p className="text-lg text-red-500">Error: {error}</p>
                        </div>
                    ) : showAvailable ? (
                        // Show available modules for purchase
                        availableModules.length === 0 ? (
                            <div className="flex justify-center items-center h-64 flex-col">
                                <p className="text-lg text-gray-600 mb-4">No modules available for purchase</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {availableModules.map((module) => (
                                    <div
                                        key={module.id}
                                        className="module-box bg-gray-100 border border-gray-300 rounded flex flex-col items-center justify-between p-4 shadow"
                                    >
                                        <img 
                                            src={module.imageUrl || getModuleImage(module.id)} 
                                            alt={module.name}
                                            className="w-16 h-16 mb-2"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = getModuleImage(module.id);
                                            }}
                                        />
                                        <p className="text-base font-semibold text-gray-800 mb-2">{module.name}</p>
                                        <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                                        <p className="text-base font-bold text-green-600 mb-3">${module.price.toFixed(2)}</p>
                                        <button
                                            onClick={() => handleModulePurchase(module.id, module.name, module.price)}
                                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full text-center"
                                        >
                                            Purchase
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : modules.length === 0 ? (
                        <div className="flex justify-center items-center h-64 flex-col">
                            <p className="text-lg text-gray-600 mb-4">No training modules found</p>
                            <p className="text-sm text-gray-500 mb-4">Purchase modules to start your training</p>
                            <button 
                                onClick={() => setShowAvailable(true)}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Browse Available Modules
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">                            {modules.map((module) => (                                <div
                                    key={module.id}
                                    className={`module-box ${!module.canAccess ? 'opacity-80' : ''} bg-gray-100 border border-gray-300 rounded flex flex-col items-center justify-between p-4 shadow cursor-pointer hover:bg-gray-200 ${module.statusText === 'Pending Approval' ? 'border-amber-500' : ''}`}
                                    onClick={() => startTraining(
                                        module.id, 
                                        module.name, 
                                        module.completion_percentage,
                                        module.canAccess,
                                        module.statusText
                                    )}
                                >
                                    {module.statusText === 'Pending Approval' && (
                                        <div className="absolute top-2 right-2 bg-amber-500 text-white rounded-full px-2 py-0.5 text-xs">
                                            Pending
                                        </div>
                                    )}
                                    <img 
                                        src={module.imageUrl || getModuleImage(module.id)} 
                                        alt={module.name}
                                        className="w-16 h-16 mb-2"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = getModuleImage(module.id);
                                        }}
                                    />
                                    <p className="text-base font-semibold text-gray-800 mb-2">{module.name}</p>
                                    <div className="w-full h-4 bg-gray-200 rounded mt-2 relative">
                                        <div 
                                            className="bg-green-500 h-full rounded" 
                                            style={{ width: `${module.completion_percentage || 0}%` }}
                                        ></div>
                                    </div>
                                    <div className="mt-2 w-full">
                                        <p className="text-sm text-gray-600">
                                            {getStatusText(module.completion_percentage)}
                                        </p>
                                        {module.statusText !== 'Active' && (
                                            <p className="text-xs text-amber-600 mt-1">
                                                {module.statusText}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Training;