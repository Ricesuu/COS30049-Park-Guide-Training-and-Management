/***********************************************************************
 * NAVIGATION BAR COMPONENT
 * Main navigation header for the visitor section with:
 * - Responsive design for mobile and desktop
 * - Dynamic navigation links with active state indicators
 * - Conditional rendering based on user authentication status
 * - Role-based dashboard access links
 ***********************************************************************/
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const NavigationBar = ({ isLoggedIn, userRole, logoutUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  /******************************************************************
   * NAVIGATION FUNCTIONS
   * Handle routing to different pages
   ******************************************************************/
  // Function to navigate to login page
  const redirectToLogin = () => {
    navigate("/login");
  };

  // Function to navigate to dashboard based on role
  const goToDashboard = () => {
    if (userRole === "admin") {
      navigate("/admin/dashboard");
    } else if (userRole === "park_guide") {
      navigate("/park_guide/dashboard");
    }
  };

  // Function to go to home/landing page
  const goToHome = () => {
    navigate("/visitor");
  };

  // Navigation functions for visitor pages
  const goToAbout = () => {
    navigate("/visitor/about");
  };

  const goToInfo = () => {
    navigate("/visitor/info");
  };

  const goToMap = () => {
    navigate("/visitor/map");
  };

  const goToFeedback = () => {
    navigate("/visitor/feedback");
  };

  const goToContact = () => {
    navigate("/visitor/contact");
  };

  /******************************************************************
   * COMPONENT RENDER
   * Responsive navbar with conditional elements based on auth status
   ******************************************************************/
  return (
    <nav className="fixed top-0 left-0 right-0 bg-black/20 backdrop-blur-sm z-50">
      <div className="w-full px-8 flex justify-between items-center h-22">
        {" "}
        {/* Left side of navbar */}{" "}
        <div className="flex items-center">
          <div className="mr-10 cursor-pointer" onClick={goToHome}>
            <img
              src="/images/SFC_LOGO_small.jpg"
              alt="SFC Logo"
              className="h-16 w-auto"
            />
          </div>{" "}
          <ul className="hidden md:flex space-x-6">
            <li>
              <a
                href="#"
                onClick={goToHome}
                className={`${
                  location.pathname === "/visitor"
                    ? "text-white font-medium after:w-full"
                    : "text-gray-300 hover:text-white after:w-0 hover:after:w-full"
                } 
                  text-sm md:text-base pb-0.5 block relative after:content-[''] after:absolute after:h-0.5 after:bg-green-500 after:left-0 after:bottom-0 after:transition-all after:duration-300`}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={goToAbout}
                className={`${
                  location.pathname === "/visitor/about"
                    ? "text-white font-medium after:w-full"
                    : "text-gray-300 hover:text-white after:w-0 hover:after:w-full"
                } 
                  text-sm md:text-base pb-0.5 block relative after:content-[''] after:absolute after:h-0.5 after:bg-green-500 after:left-0 after:bottom-0 after:transition-all after:duration-300`}
              >
                About Us
              </a>
            </li>
            <li>
              {" "}
              <a
                href="#"
                onClick={goToInfo}
                className="text-gray-300 hover:text-white pb-0.5 block relative after:content-[''] after:absolute after:h-0.5 after:w-0 after:bg-green-500 after:left-0 after:bottom-0 hover:after:w-full after:transition-all after:duration-300 text-sm md:text-base"
              >
                Info
              </a>
            </li>
            <li>
              {" "}
              <a
                href="#"
                onClick={goToMap}
                className="text-gray-300 hover:text-white pb-0.5 block relative after:content-[''] after:absolute after:h-0.5 after:w-0 after:bg-green-500 after:left-0 after:bottom-0 hover:after:w-full after:transition-all after:duration-300 text-sm md:text-base"
              >
                Map
              </a>
            </li>
            <li>
              {" "}
              <a
                href="#"
                onClick={goToFeedback}
                className="text-gray-300 hover:text-white pb-0.5 block relative after:content-[''] after:absolute after:h-0.5 after:w-0 after:bg-green-500 after:left-0 after:bottom-0 hover:after:w-full after:transition-all after:duration-300 text-sm md:text-base"
              >
                Feedback
              </a>
            </li>
            <li>
              {" "}
              <a
                href="#"
                onClick={goToContact}
                className={`${
                  location.pathname === "/visitor/contact"
                    ? "text-white font-medium after:w-full"
                    : "text-gray-300 hover:text-white after:w-0 hover:after:w-full"
                } 
                  text-sm md:text-base pb-0.5 block relative after:content-[''] after:absolute after:h-0.5 after:bg-green-500 after:left-0 after:bottom-0 after:transition-all after:duration-300`}
              >
                Contact
              </a>
            </li>
            {/* Conditional dashboard links based on user role */}
            {isLoggedIn && userRole === "admin" && (
              <li>
                <a
                  href="#"
                  onClick={goToDashboard}
                  className="text-gray-300 hover:text-white pb-0.5 block relative after:content-[''] after:absolute after:h-0.5 after:w-0 after:bg-green-500 after:left-0 after:bottom-0 hover:after:w-full after:transition-all after:duration-300 text-sm md:text-base"
                >
                  Admin Dashboard
                </a>
              </li>
            )}
            {isLoggedIn && userRole === "park_guide" && (
              <li>
                <a
                  href="#"
                  onClick={goToDashboard}
                  className="text-gray-300 hover:text-white pb-0.5 block relative after:content-[''] after:absolute after:h-0.5 after:w-0 after:bg-green-500 after:left-0 after:bottom-0 hover:after:w-full after:transition-all after:duration-300 text-sm md:text-base"
                >
                  Guide Dashboard
                </a>
              </li>
            )}
          </ul>
        </div>{" "}
        {/* Right side of navbar */}
        <div className="flex items-center space-x-6">
          <div className="cursor-pointer">
            
          </div>
          {/* Conditional login/logout button */}{" "}
          {!isLoggedIn ? (
            <button
              onClick={redirectToLogin}
              className="border border-white text-white hover:bg-green-600 hover:text-white py-2 px-5 rounded-lg text-sm md:text-base font-medium transition-colors cursor-pointer hover:border-transparent"
            >
              Log In
            </button>
          ) : (
            <button
              onClick={logoutUser}
              className="bg-red-500 hover:bg-white text-white hover:text-red-500 py-2 px-5 rounded-lg text-sm md:text-base font-medium transition-colors cursor-pointer border border-transparent hover:border-red-500"
            >
              Log Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
