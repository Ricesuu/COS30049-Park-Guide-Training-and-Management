import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Chart from 'chart.js/auto';

const Performance = () => {
    const router = useRouter();

    const navigateTo = (page) => {
        router.push(page);
    };

    useEffect(() => {
        // Bar Chart
        const barCtx = document.getElementById('barChart').getContext('2d');
        new Chart(barCtx, {
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

        // Pie Chart
        const pieCtx = document.getElementById('pieChart').getContext('2d');
        new Chart(pieCtx, {
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
            <div className="main-content flex flex-grow p-4">
                {/* Left Column */}
                <div className="left-column flex flex-col flex-grow">
                    {/* Bar Chart */}
                    <div className="bg-white p-6 rounded shadow mb-4">
                        <h2 className="text-lg font-bold mb-4 text-center">Performance Bar Chart</h2>
                        <canvas id="barChart" className="w-full h-64"></canvas>
                    </div>
                    {/* Pie Chart */}
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-lg font-bold mb-4 text-center">Feedback Pie Chart</h2>
                        <canvas id="pieChart" className="w-full h-64"></canvas>
                    </div>
                </div>

                {/* Right Column */}
                <div className="right-column bg-white p-6 rounded shadow w-1/3 flex flex-col">
                    <h2 className="text-lg font-bold mb-4 text-center">Recommendations</h2>
                    <ul className="list-disc list-inside text-gray-700 flex-grow">
                        <li>Improve guide training based on feedback.</li>
                        <li>Focus on areas with low performance scores.</li>
                        <li>Enhance visitor experience in underperforming zones.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Performance;