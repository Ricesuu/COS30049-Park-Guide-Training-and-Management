import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NavigationBar = ({ isLoggedIn, userRole, logoutUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black/20 backdrop-blur-sm z-50">
      <div className="w-full px-8 flex justify-between items-center h-22">
        {/* Left side of navbar */}
        <div className="flex items-center">
          <div className="text-2xl md:text-3xl font-bold text-white mr-10">
            SFC
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
              <a
                href="#"
                onClick={goToInfo}
                className="text-gray-300 hover:text-white pb-0.5 block relative after:content-[''] after:absolute after:h-0.5 after:w-0 after:bg-green-500 after:left-0 after:bottom-0 hover:after:w-full after:transition-all after:duration-300 text-sm md:text-base"
              >
                Info
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={goToMap}
                className="text-gray-300 hover:text-white pb-0.5 block relative after:content-[''] after:absolute after:h-0.5 after:w-0 after:bg-green-500 after:left-0 after:bottom-0 hover:after:w-full after:transition-all after:duration-300 text-sm md:text-base"
              >
                Map
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={goToFeedback}
                className="text-gray-300 hover:text-white pb-0.5 block relative after:content-[''] after:absolute after:h-0.5 after:w-0 after:bg-green-500 after:left-0 after:bottom-0 hover:after:w-full after:transition-all after:duration-300 text-sm md:text-base"
              >
                Feedback
              </a>
            </li>
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
        </div>
        {/* Right side of navbar */}
        <div className="flex items-center space-x-4">
          <div className="cursor-pointer">
            <img
              src="/search-icon.png"
              alt="Search"
              className="w-5 h-5 invert hover:opacity-80 transition-opacity"
            />
          </div>
          {!isLoggedIn ? (
            <button
              onClick={redirectToLogin}
              className="bg-green-600 hover:bg-white text-white hover:text-green-700 py-2 px-5 rounded-lg text-sm md:text-base font-medium transition-colors cursor-pointer border border-transparent hover:border-green-600"
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
          <button
            onClick={goToContact}
            className="border border-white text-white hover:bg-white hover:text-green-700 py-2 px-5 rounded-lg text-sm md:text-base font-medium transition-colors cursor-pointer"
          >
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
