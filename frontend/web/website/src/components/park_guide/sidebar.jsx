import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import "../../ParkGuideStyle.css";

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();
  const auth = getAuth();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // 🔐 Sign out from Firebase
      localStorage.removeItem("token"); // Optional cleanup
      sessionStorage.removeItem("token");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally show toast or error message here
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 ${isCollapsed ? "w-16" : "w-64"} bg-green-800 text-white h-screen p-6 space-y-6 transition-all duration-300`}
    >
      <button
        onClick={toggleSidebar}
        className="text-white hover:text-green-300 mb-4"
      >
        {isCollapsed ? ">" : "<"}
      </button>

      {isCollapsed ? null : (
        <>
          <div className="flex items-center space-x-2 mb-6">
            <img
              src="https://www.sarawakforestry.com/layout2/wp-content/uploads/2020/11/SFC_LOGO_small.jpg"
              alt="Logo"
              className="h-25 w-25"
            />
          </div>

          <h2 className="text-2xl font-bold">SFC Park Guide</h2>

          <nav className="space-y-4">
            <Link to="/park_guide/dashboard">
              <p className="block text-white hover:text-green-300 p-3">Dashboard</p>
            </Link>
            <Link to="/park_guide/training">
              <p className="block text-white hover:text-green-300 p-3">Training Module</p>
            </Link>
            <Link to="/park_guide/certifications">
              <p className="block text-white hover:text-green-300 p-3">Certification & Licensing</p>
            </Link>
            <Link to="/park_guide/performance">
              <p className="block text-white hover:text-green-300 p-3">Performance</p>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left block text-white hover:text-black p-3 hover:bg-gray-300 bg-lime-600 rounded-xl"
            >
              Logout
            </button>
          </nav>
        </>
      )}
    </div>
  );
}
