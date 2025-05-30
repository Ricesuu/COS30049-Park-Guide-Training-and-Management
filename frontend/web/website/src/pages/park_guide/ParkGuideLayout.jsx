import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/park_guide/sidebar";
import "../../ParkGuideStyle.css";

export default function ParkGuideLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex">
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      <main
        className={`flex-1 ${isSidebarCollapsed ? 'pl-16' : 'pl-64'} bg-gray-100 min-h-screen transition-all duration-300 overflow-hidden`}
      >
        <div className="w-full h-full overflow-auto p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
