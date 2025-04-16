import { useRouter } from 'next/router';
const Dashboard = () => {
    const router = useRouter();

    const navigateTo = (page) => {
        router.push(page);
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
                {/* Left Column */}
                <div className="left-column flex flex-col flex-grow-3">
                    <div className="box bg-white p-4 m-2 rounded shadow">
                        <h2 className="text-lg font-bold">Performance</h2>
                    </div>
                    <div className="box bg-white p-4 m-2 rounded shadow">
                        <h2 className="text-lg font-bold">Alert</h2>
                    </div>
                </div>
                {/* Right Column */}
                <div className="right-column bg-white p-4 m-2 rounded shadow flex-grow-0.3">
                    <div className="flex flex-col justify-between h-full">
                        <h2 className="text-lg font-bold mb-4">Certification & Licensing</h2>
                        {/* Add additional content here if needed */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;