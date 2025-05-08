import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Chart } from 'chart.js';
import DashboardChart from '../../components/DashboardChart';
import RecentActivityLogs from '../../components/RecentActivityLogs';

export default function Dashboard() {
    return (
        <div className="flex-1 p-8 bg-gray-100 min-h-screen space-y-8">
        <h2 className="text-2xl font-semibold text-green-900">Welcome to SFC Admin Dashboard</h2>
  
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow p-4 border-l-4 border-yellow-500">
            <h3 className="text-sm text-gray-500">Licenses Renewal</h3>
            <p className="text-2xl font-bold text-yellow-800">3</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 border-l-4 border-blue-500">
            <h3 className="text-sm text-gray-500">Licenses Approval</h3>
            <p className="text-2xl font-bold text-blue-800">12</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 border-l-4 border-red-500">
            <h3 className="text-sm text-gray-500">Alerts</h3>
            <p className="text-2xl font-bold text-red-800">7</p>
          </div>
        </div>
  
        
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">Daily Observation Trend</h3>
          <DashboardChart/>
        </div>
  
        
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">Recent Activities</h3>
            <RecentActivityLogs/>
        </div>

        
      </div>
    );
}