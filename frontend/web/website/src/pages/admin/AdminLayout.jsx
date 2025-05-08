import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar"; // adjust path if needed

export default function AdminLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 pl-64 bg-gray-100 min-h-screen">
        <Outlet /> {/* Renders the nested route component */}
      </main>
    </div>
  );
}
