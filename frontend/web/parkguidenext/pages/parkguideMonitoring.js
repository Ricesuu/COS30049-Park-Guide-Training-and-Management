import { useRouter } from 'next/router';

const Monitoring = () => {
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
                    <div className="monitoringbox bg-white p-4 m-2 rounded shadow">
                        <iframe
                            className="w-full h-[30rem] rounded shadow"
                            src="https://www.youtube.com/embed/fRhtivCmiKo?si=KM-JjMp7NELS1Ltw&start=717"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                    <div className="box bg-white p-4 m-2 rounded shadow flex flex-col justify-start flex-grow">
                        <h2 className="text-lg font-bold mb-2">Alert</h2>
                        {/* Add alert content here */}
                    </div>
                </div>

                {/* Right Column */}
                <div className="right-column bg-white p-4 m-2 rounded shadow overflow-y-auto">
                    <div className="flex flex-col h-full">
                        <h2 className="text-lg font-bold mb-4 text-center">Comments</h2>
                        {/* Add Comment Section */}
                        <div className="mb-4">
                            <textarea
                                className="w-full h-16 p-2 border rounded shadow mb-2"
                                placeholder="Add a public comment..."
                            ></textarea>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600">
                                Comment
                            </button>
                        </div>
                        {/* Existing Comments */}
                        <div className="flex flex-col space-y-4 h-64 overflow-y-auto">
                            <div className="comment bg-gray-100 p-3 rounded shadow">
                                <p className="font-bold">User1</p>
                                <p>Great video! Very informative.</p>
                            </div>
                            <div className="comment bg-gray-100 p-3 rounded shadow">
                                <p className="font-bold">User2</p>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque leo est, lobortis vitae bibendum imperdiet, convallis ut diam. In sit amet fringilla elit...
                                </p>
                            </div>
                            <div className="comment bg-gray-100 p-3 rounded shadow">
                                <p className="font-bold">User3</p>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque leo est, lobortis vitae bibendum imperdiet, convallis ut diam. In sit amet fringilla elit...
                                </p>
                            </div>
                            {/* Add more comments here */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Monitoring;