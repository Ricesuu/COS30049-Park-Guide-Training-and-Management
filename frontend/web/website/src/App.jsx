import React from "react";
import "./App.css";
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
import CourseManager from "./pages/admin/CourseManager";
import QuizEditor from "./pages/admin/QuizEditor";
import AdminLayout from "./pages/admin/AdminLayout";

// 🌿 Park Guide Pages
import ParkGuideLayout from "./pages/park_guide/ParkGuideLayout";
import ParkguideDashboard from "./pages/park_guide/parkguideDashboard";
import ParkguideTraining from "./pages/park_guide/parkguideTraining";
import ParkguideCert from "./pages/park_guide/parkguideCert";
import ParkguidePlantInfo from "./pages/park_guide/parkguidePlantInfo";
import ParkguideIdentification from "./pages/park_guide/parkguideIdentification";
import ParkguidePerformance from "./pages/park_guide/parkguidePerformance";
import ParkguideModule from "./pages/park_guide/parkguideModule";
import ParkguideQuiz from "./pages/park_guide/parkguideQuiz";
import ParkguidePayment from "./pages/park_guide/parkguidePayment";

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
      {/* Admin Section */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="iot-hub" element={<IoTHub />} />
        <Route path="info-manager" element={<InfoManager />} />
        <Route path="info-manager/:title" element={<InfoDetail />} />
        <Route path="park-guides" element={<ParkGuides />} />
        <Route path="guides/:id" element={<ParkGuideDetails />} />
        <Route path="course-manager" element={<CourseManager />} />
        <Route path="quiz-editor" element={<QuizEditor />} />
      </Route>

      {/* Park Guide Section */}
      <Route path="/park_guide" element={<ParkGuideLayout />}>
        <Route path="dashboard" element={<ParkguideDashboard />} />
        <Route path="training" element={<ParkguideTraining />} />
        <Route path="certifications" element={<ParkguideCert />} />
        <Route path="plants" element={<ParkguidePlantInfo />} />
        <Route path="identify" element={<ParkguideIdentification />} />
        <Route path="performance" element={<ParkguidePerformance />} />
        <Route path="module" element={<ParkguideModule />} />
        <Route path="quiz" element={<ParkguideQuiz />} />
        <Route path="payment" element={<ParkguidePayment />} />
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
