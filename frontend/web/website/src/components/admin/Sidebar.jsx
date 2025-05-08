import React from "react";
import { Link } from "react-router-dom";


export default function Sidebar() {
  return (
    <div className="fixed top-0 left-0 w-64 bg-green-800 text-white h-screen p-6 space-y-6">
        <div className="flex items-center space-x-2 mb-6">
            <img src="https://www.sarawakforestry.com/layout2/wp-content/uploads/2020/11/SFC_LOGO_small.jpg" alt="Logo" className="h-25 w-25" /> 
        </div>
        
        <h2 className="text-2xl font-bold">SFC Admin</h2>
        <nav className="space-y-4">
            <Link to="/admin/dashboard" ><p className="block text-white hover:text-green-300 p-4">Dashboard</p></Link>
            <Link to="/admin/iot-hub" ><p className="block text-white hover:text-green-300 p-4">IoT Hub</p></Link>
            <Link to="/admin/info-manager" ><p className="block text-white hover:text-green-300 p-4">Info Manager</p></Link>
            <Link to="/admin/info-manager" ><p className="block text-white hover:text-green-300 p-4">Course Manager</p></Link>
            <Link to="/admin/park-guides"><p className="block text-white hover:text-green-300 p-4">Park Guides</p></Link>
        </nav>
    </div>
  );
}