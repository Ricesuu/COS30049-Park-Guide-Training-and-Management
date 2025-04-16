import { useRouter } from 'next/router';

const Certification = () => {
    const router = useRouter();

    const navigateTo = (page) => {
        router.push(page);
    };

    const showCertDetails = (certName, expiryDate, isComplete) => {
        if (isComplete) {
            alert(`Certification: ${certName}\nExpiry Date: ${expiryDate}`);
        } else {
            router.push('/parkguideQuiz'); // Redirect to the quiz page if the certification is incomplete
        }
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
                    <h2 className="text-lg font-bold mb-4 text-center">Certification & Licensing</h2>
                    {/* Grid of Certifications */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {/* Certification 1 (Full Progress Bar) */}
                        <div
                            className="cert-box bg-gray-100 border border-gray-300 rounded flex flex-col items-center justify-between p-4 shadow cursor-pointer hover:bg-gray-200"
                            onClick={() => showCertDetails('Semenggoh Park Guide', '2025-12-31', true)}
                        >
                            <img src="/images/cert1.png" alt="Semenggoh Park Guide" className="w-16 h-16 mb-2" />
                            <p className="text-base font-semibold text-gray-800 mb-2">Semenggoh Park Guide</p>
                            {/* Horizontal Progress Bar */}
                            <div className="w-full h-4 bg-gray-200 rounded mt-2 relative">
                                <div className="bg-green-500 h-full rounded" style={{ width: '100%' }}></div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">Expiry: 2025-12-31</p>
                        </div>
                        {/* Certification 2 (Incomplete Progress Bar) */}
                        <div
                            className="cert-box bg-gray-100 border border-gray-300 rounded flex flex-col items-center justify-between p-4 shadow cursor-pointer hover:bg-gray-200"
                            onClick={() => showCertDetails('Certification 2', '', false)}
                        >
                            <img src="/images/cert2.png" alt="Certification 2" className="w-16 h-16 mb-2" />
                            <p className="text-base font-semibold text-gray-800 mb-2">Certification 2</p>
                            {/* Horizontal Progress Bar */}
                            <div className="w-full h-4 bg-gray-200 rounded mt-2 relative">
                                <div className="bg-green-500 h-full rounded" style={{ width: '0%' }}></div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">In Progress</p>
                        </div>
                        {/* Add more certifications as needed */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Certification;