import React from "react";
import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AnimatePresence } from "framer-motion";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import "react-toastify/dist/ReactToastify.css";

// 🔐 Auth Pages
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";
import ForgotPasswordPage from "./pages/auth/Forgot_Password";
import ResetPasswordPage from "./pages/auth/Reset_Password";

// 🏠 Visitor Pages
import VisitorLandingPage from "./pages/visitor/index";
import AboutPage from "./pages/visitor/about";
import ContactPage from "./pages/visitor/contact";
import FeedbackPage from "./pages/visitor/feedback";
import MapPage from "./pages/visitor/map";
import InfoPage from "./pages/visitor/info";

// 🛠️ Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import ParkGuides from "./pages/admin/ParkGuides";
import ParkGuideDetails from "./pages/admin/ParkGuideDetails";
import IoTHub from "./pages/admin/IoTHub";
import AssignCourse from "./pages/admin/AdminAssignCourses";
import InfoManager from "./pages/admin/InfoManager";
import CourseManager from "./pages/admin/CourseManager";
import QuizEditor from "./pages/admin/QuizEditor";
import AdminLayout from "./pages/admin/AdminLayout";

// 🌿 Park Guide Pages
import ParkGuideLayout from "./pages/park_guide/ParkGuideLayout";
import ParkguideDashboard from "./pages/park_guide/parkguideDashboard";
import ParkguideTraining from "./pages/park_guide/parkguideTraining";
import ParkguideCert from "./pages/park_guide/parkguideCert";
import ParkguidePerformance from "./pages/park_guide/parkguidePerformance";
import ParkguideModule from "./pages/park_guide/parkguideModule";
import ParkguideQuiz from "./pages/park_guide/parkguideQuiz";


// Import the landing page
import LandingPage from "./pages/index";

// Import the module purchasing page
import ModulePurchase from "./pages/modules/ModulePurchase";


function AppRoutes() {
  const location = useLocation();
  const { loading, user, userRole } = useAuth();

  // If the auth context is still loading, show nothing or a loading spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  const isAuthRoute = [
    "/login",
    "/register",
    "/forgot_password",
    "/reset_password",
  ].includes(location.pathname);
  const isHomeRoute = location.pathname === "/";

  if (isHomeRoute) {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </AnimatePresence>
    );
  }

  if (isAuthRoute) {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot_password" element={<ForgotPasswordPage />} />
          <Route path="/reset_password" element={<ResetPasswordPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    );  }

  // Function to protect routes based on role
  const ProtectedRoute = ({ element, allowedRoles }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(userRole)) return <Navigate to="/unauthorized" replace />;
    return element;
  };

  return (
    <Routes location={location} key={location.pathname}>
      {/* Visitor Section - Public Routes */}
      <Route path="/visitor" element={<VisitorLandingPage />} />
      <Route path="/visitor/about" element={<AboutPage />} />
      <Route path="/visitor/contact" element={<ContactPage />} />
      <Route path="/visitor/feedback" element={<FeedbackPage />} />
      <Route path="/visitor/map" element={<MapPage />} />
      <Route path="/visitor/info" element={<InfoPage />} />
      
      {/* Admin Section - Protected Routes */}
      <Route path="/admin" 
        element={<ProtectedRoute element={<AdminLayout />} allowedRoles={["admin"]} />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="iot-hub" element={<IoTHub />} />
        <Route path="park-guides" element={<ParkGuides />} />
        <Route path="guides/:id" element={<ParkGuideDetails />} />        
        <Route path="assign-course" element={<AssignCourse />} />
        <Route path="info-manager" element={<InfoManager />} />
        <Route path="course-manager" element={<CourseManager />} />
        <Route path="quiz-editor" element={<QuizEditor />} />
      </Route>
      
      {/* Park Guide Section - Protected Routes */}
      <Route path="/park_guide" 
        element={<ProtectedRoute element={<ParkGuideLayout />} allowedRoles={["park_guide"]} />}>
        <Route path="dashboard" element={<ParkguideDashboard />} />
        <Route path="training" element={<ParkguideTraining />} />
        <Route path="certifications" element={<ParkguideCert />} />
        <Route path="performance" element={<ParkguidePerformance />} />        
        <Route path="module" element={<ParkguideModule />} />
        <Route path="quiz" element={<ParkguideQuiz />} />
      </Route>

      {/* Module Purchase Section */}
      <Route path="/modules/purchase/:moduleId" element={<ModulePurchase />} />

      {/* Catch-all route redirects to the landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}
