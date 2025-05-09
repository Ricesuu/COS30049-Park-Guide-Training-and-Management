import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

export default function Sidebar() {
  const navigate = useNavigate();
  const auth = getAuth();

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
    <div className="fixed top-0 left-0 w-64 bg-green-800 text-white h-screen p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <img
          src="https://www.sarawakforestry.com/layout2/wp-content/uploads/2020/11/SFC_LOGO_small.jpg"
          alt="Logo"
          className="h-25 w-25"
        />
      </div>

      <h2 className="text-2xl font-bold">SFC Admin</h2>
      <nav className="space-y-4">
        <Link to="/admin/dashboard">
          <p className="block text-white hover:text-green-300 p-3">Dashboard</p>
        </Link>
        <Link to="/admin/iot-hub">
          <p className="block text-white hover:text-green-300 p-3">IoT Hub</p>
        </Link>
        <Link to="/admin/info-manager">
          <p className="block text-white hover:text-green-300 p-3">Info Manager</p>
        </Link>
        <Link to="/admin/assign-course">
          <p className="block text-white hover:text-green-300 p-3">Assign Courses</p>
        </Link>
        <Link to="/admin/course-manager">
          <p className="block text-white hover:text-green-300 p-3">Course Manager</p>
        </Link>
        <Link to="/admin/quiz-editor">
          <p className="block text-white hover:text-green-300 p-3">Quiz Editor</p>
        </Link>
        <Link to="/admin/park-guides">
          <p className="block text-white hover:text-green-300 p-3">Park Guides</p>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full text-left block text-white hover:text-black p-3 hover:bg-gray-300 bg-lime-600 rounded-xl"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}
