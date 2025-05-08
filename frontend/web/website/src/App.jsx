import React from "react";
import './App.css';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

// 🔐 Auth Pages
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";
import ForgotPasswordPage from "./pages/auth/Forgot_Password";
import ResetPasswordPage from "./pages/auth/Reset_Password";

// 🛠️ Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import InfoManager from "./pages/admin/InfoManager";
import InfoDetail from "./pages/admin/InfoDetail";
import ParkGuides from "./pages/admin/ParkGuides";
import ParkGuideDetails from "./pages/admin/ParkGuideDetails";
import IoTHub from "./pages/admin/IoTHub";
import AdminLayout from "./pages/admin/AdminLayout";

function AppRoutes() {
  const location = useLocation();
  const isAuthRoute = ["/", "/login", "/register", "/forgot_password", "/reset_password"].includes(location.pathname);

  if (isAuthRoute) {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot_password" element={<ForgotPasswordPage />} />
          <Route path="/reset_password" element={<ResetPasswordPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>
    );
  }

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="iot-hub" element={<IoTHub />} />
        <Route path="info-manager" element={<InfoManager />} />
        <Route path="info-manager/:title" element={<InfoDetail />} />
        <Route path="park-guides" element={<ParkGuides />} />
        <Route path="guides/:id" element={<ParkGuideDetails />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <>
      <AppRoutes />
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}
