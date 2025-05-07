import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const Dashboard = () => {
    const router = useRouter();

    const barChartRef = useRef(null); // Reference for the bar chart
    const pieChartRef = useRef(null); // Reference for the pie chart

    const navigateTo = (page) => {
        router.push(page);
    };

    useEffect(() => {
        // Ensure the canvas elements exist before initializing the charts
        const barCanvas = document.getElementById('barChart');
        const pieCanvas = document.getElementById('pieChart');

        if (barCanvas) {
            const barCtx = barCanvas.getContext('2d');
            barChartRef.current = new Chart(barCtx, {
                type: 'bar',
                data: {
                    labels: ['Zone A', 'Zone B', 'Zone C', 'Zone D'],
                    datasets: [
                        {
                            label: 'Performance Score',
                            data: [85, 70, 90, 60],
                            backgroundColor: ['#4CAF50', '#FF9800', '#2196F3', '#F44336'],
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                    },
                    scales: {
                        y: { beginAtZero: true },
                    },
                },
            });
        }

        if (pieCanvas) {
            const pieCtx = pieCanvas.getContext('2d');
            pieChartRef.current = new Chart(pieCtx, {
                type: 'pie',
                data: {
                    labels: ['Positive', 'Neutral', 'Negative'],
                    datasets: [
                        {
                            data: [60, 20, 20],
                            backgroundColor: ['#4CAF50', '#FFEB3B', '#F44336'],
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'bottom' },
                    },
                },
            });
        }

        // Cleanup function to destroy charts when the component unmounts
        return () => {
            if (barChartRef.current) {
                barChartRef.current.destroy();
            }
            if (pieChartRef.current) {
                pieChartRef.current.destroy();
            }
        };
    }, []);

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
                <div className="left-column flex flex-col flex-grow-3 gap-4 p-4">
                    {/* Performance Section */}
                    <div className="box bg-white p-4 rounded shadow">
                        <h2 className="text-lg font-bold mb-4 text-center">Performance Bar Chart</h2>
                        <canvas id="barChart" className="w-full h-36"></canvas>
                    </div>

                    {/* Alert Section */}
                    <div className="box bg-white p-4 rounded shadow">
                        <h2 className="text-lg font-bold">Alerts</h2>
                        <ul className="list-disc list-inside">
                            <li className="flex items-center">
                                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                                Zone A requires immediate attention due to low visitor satisfaction.
                            </li>
                            <li className="flex items-center">
                                <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                                Training Module 2 completion rate is below 50%.
                            </li>
                            <li className="flex items-center">
                                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                                Certification 3 is nearing its expiry date.
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right Column */}
                <div className="right-column flex flex-col bg-white p-4 m-2 rounded shadow flex-grow">
                    {/* Certification & Licensing Box */}
                    <div className="box bg-white p-4 rounded shadow h-full w-full">
                        {/* Title */}
                        <h2 className="text-lg font-bold mb-4 text-center">Certification & Licensing</h2>

                        {/* Certification Grid */}
                        <div className="flex flex-col gap-4 w-full">
                            {/* Certification 1 */}
                            <div className="cert-box bg-gray-100 border border-gray-300 rounded p-4 shadow w-full">
                                <div className="flex items-center">
                                    <img src="/images/Semenggoh.jpg" alt="Certification 1" className="w-16 h-16 mr-4" />
                                    <div className="text-center flex-grow">
                                        <h3 className="text-base font-semibold">Semenggoh Park Guide</h3>
                                        <p className="text-sm text-gray-600">Expiry: 2025-12-31</p>
                                    </div>
                                </div>
                            </div>

                            {/* Certification 2 */}
                            <div className="cert-box bg-gray-100 border border-gray-300 rounded p-4 shadow w-full">
                                <div className="flex items-center">
                                    <img src="/images/cert2.png" alt="Certification 2" className="w-16 h-16 mr-4" />
                                    <div className="text-center flex-grow">
                                        <h3 className="text-base font-semibold">Certification 2</h3>
                                        <p className="text-sm text-gray-600">In Progress</p>
                                    </div>
                                </div>
                            </div>

                            {/* Add more certifications as needed */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default Dashboard;