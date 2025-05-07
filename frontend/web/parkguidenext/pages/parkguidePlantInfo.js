import { useState } from 'react';
import { useRouter } from 'next/router';

const PlantInfo = () => {
    const router = useRouter();
    const [popup, setPopup] = useState({ isVisible: false, title: '', description: '' });

    const navigateTo = (page) => {
        router.push(page);
    };

    const showPlantDetails = (title, description) => {
        setPopup({ isVisible: true, title, description });
    };

    const closePopup = () => {
        setPopup({ isVisible: false, title: '', description: '' });
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
            <div className="main-content flex flex-grow p-4">
                <div className="bg-white p-6 rounded shadow w-full h-full">
                    <h2 className="text-lg font-bold mb-4 text-center">Plant Information</h2>
                    {/* Grid of Plant Info */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {/* Plant 1 */}
                        <div
                            className="bg-gray-100 border border-gray-300 rounded flex flex-col items-center justify-between p-4 shadow cursor-pointer hover:bg-gray-200"
                            onClick={() => showPlantDetails('Plant 1', 'This is a description of Plant 1.')}
                        >
                            <img src="/images/plant1.png" alt="Plant 1" className="w-16 h-16 mb-2" />
                            <p className="text-base font-semibold text-gray-800 mb-2">Plant 1</p>
                        </div>
                        {/* Plant 2 */}
                        <div
                            className="bg-gray-100 border border-gray-300 rounded flex flex-col items-center justify-between p-4 shadow cursor-pointer hover:bg-gray-200"
                            onClick={() => showPlantDetails('Plant 2', 'This is a description of Plant 2.')}
                        >
                            <img src="/images/plant2.png" alt="Plant 2" className="w-16 h-16 mb-2" />
                            <p className="text-base font-semibold text-gray-800 mb-2">Plant 2</p>
                        </div>
                        {/* Add more plants as needed */}
                    </div>
                </div>
            </div>

            {/* Popup Modal */}
            {popup.isVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h2 className="text-lg font-bold mb-4">{popup.title}</h2>
                        <p className="text-gray-700 mb-4">{popup.description}</p>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
                            onClick={closePopup}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlantInfo;