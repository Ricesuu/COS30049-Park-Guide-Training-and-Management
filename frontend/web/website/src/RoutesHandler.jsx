import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";
import ForgotPasswordPage from "./pages/auth/Forgot_Password";
import ResetPasswordPage from "./pages/auth/Reset_Password";
import Dashboard from './pages/admin/Dashboard';
import InfoManager from './pages/admin/InfoManager';
import InfoDetail from './pages/admin/InfoDetail';
import ParkGuides from './pages/admin/ParkGuides';
import ParkGuideDetails from './pages/admin/ParkGuideDetails';
import IoTHub from './pages/admin/IoTHub';
import Sidebar from './components/Sidebar';

export default function RoutesHandler() {
  const location = useLocation();

  const isAuthRoute = ["/", "/login", "/register", "/forgot_password", "/reset_password"].includes(location.pathname);
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAuthRoute) {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot_password" element={<ForgotPasswordPage />} />
          <Route path="/reset_password" element={<ResetPasswordPage />} />
        </Routes>
      </AnimatePresence>
    );
  }

  return (
    <div className="flex">
      {isAdminRoute && <Sidebar />}
      <main className={`flex-1 ${isAdminRoute ? "pl-64" : ""} bg-gray-100 min-h-screen`}>
        <Routes>
          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/iot-hub" element={<IoTHub />} />
          <Route path="/admin/info-manager" element={<InfoManager />} />
          <Route path="/admin/info-manager/:title" element={<InfoDetail />} />
          <Route path="/admin/park-guides" element={<ParkGuides />} />
          <Route path="/admin/guides/:id" element={<ParkGuideDetails />} />

          {/* Other roles' routes (add park guide routes, visitor routes, etc. here) */}
        </Routes>
      </main>
    </div>
  );
}

