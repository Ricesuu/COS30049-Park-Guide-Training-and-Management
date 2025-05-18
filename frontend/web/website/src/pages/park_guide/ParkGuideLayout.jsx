import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/park_guide/sidebar";
import "../../ParkGuideStyle.css";

export default function ParkGuideLayout() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <Outlet />
    </div>
  );
}
