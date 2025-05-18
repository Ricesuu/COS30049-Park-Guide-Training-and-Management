import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import NavigationBar from "../../components/visitor/NavigationBar";
import Footer from "../../components/visitor/Footer";
import TestimonialsCarousel from "../../components/visitor/TestimonialsCarousel";

const VisitorLandingPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const videoContainerRef = useRef(null);

  // Check if user is authenticated when the component mounts
  useEffect(() => {
    // Check for authentication from localStorage
    const authToken = localStorage.getItem("authToken");
    const userRoleValue = localStorage.getItem("userRole");
    const loggedInValue = localStorage.getItem("isLoggedIn");

    if (authToken && loggedInValue === "true") {
      setIsLoggedIn(true);
      setUserRole(userRoleValue);
    }
  }, []);

  // Function to handle logout
  const logoutUser = () => {
    // Clear auth data
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isLoggedIn");

    // Update state
    setIsLoggedIn(false);
    setUserRole(null);

    // Refresh the page to reflect the changes
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen bg-white text-gray-800"
    >
      <NavigationBar
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        logoutUser={logoutUser}
      />
      {/* Hero Section with YouTube Video Background */}
      <section className="pt-24 min-h-screen relative flex items-center overflow-hidden">
        {/* YouTube Video Background */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <div className="relative w-full h-full">
            <iframe
              className="absolute w-[150%] h-[150%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              src="https://www.youtube.com/embed/THrCxzbjaYM?autoplay=1&mute=1&controls=0&loop=1&playlist=THrCxzbjaYM&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              frameBorder="0"
              title="Background Video"
            ></iframe>
          </div>
          {/* Dark overlay to make the text readable */}
          <div className="absolute inset-0 bg-black/60 z-10"></div>
        </div>
        {/* Hero Content */}
        <div className="container mx-auto px-4 text-center text-white py-24 relative z-20">
          {" "}
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to Park Guide Training and Management
          </h1>
          <p className="text-xl md:text-2xl mb-10">
            Discover, Learn, and Connect with Nature
          </p>{" "}
          <button
            onClick={
              isLoggedIn
                ? () =>
                    navigate(
                      userRole === "admin"
                        ? "/admin/dashboard"
                        : "/park_guide/dashboard"
                    )
                : () => navigate("/login")
            }
            className="bg-green-600 hover:bg-white text-white hover:text-green-700 py-2.5 px-7 rounded-lg font-medium text-sm md:text-base transition-colors cursor-pointer border border-transparent hover:border-green-600"
          >
            {isLoggedIn ? "Go to Dashboard" : "Get Started"}
          </button>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to become an expert park guide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <img
                  src="/book-icon.png"
                  alt="Training"
                  className="w-12 h-12 mx-auto"
                />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">
                Training Modules
              </h3>
              <p className="text-gray-600 text-center mb-5">
                Comprehensive learning materials to enhance your knowledge about
                the park and its ecosystem.
              </p>{" "}
              <div className="text-center">
                <a
                  onClick={() => navigate("/visitor/training")}
                  className="text-green-600 hover:text-green-800 font-medium inline-flex items-center cursor-pointer transition-colors"
                >
                  Learn More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <img
                  src="/certificate-icon.png"
                  alt="Certification"
                  className="w-12 h-12 mx-auto"
                />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">
                Certification
              </h3>
              <p className="text-gray-600 text-center mb-5">
                Earn official certifications to validate your expertise as a
                park guide.
              </p>{" "}
              <div className="text-center">
                <a
                  onClick={() => navigate("/visitor/certification")}
                  className="text-green-600 hover:text-green-800 font-medium inline-flex items-center cursor-pointer transition-colors"
                >
                  Learn More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <img
                  src="/leaf-icon.png"
                  alt="Plant Information"
                  className="w-12 h-12 mx-auto"
                />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">
                Plant Information
              </h3>
              <p className="text-gray-600 text-center mb-5">
                Access detailed information about the flora and fauna within the
                park.
              </p>{" "}
              <div className="text-center">
                <a
                  onClick={() => navigate("/visitor/plant-info")}
                  className="text-green-600 hover:text-green-800 font-medium inline-flex items-center cursor-pointer transition-colors"
                >
                  Learn More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from park guides who have experienced our training program
            </p>
          </div>

          <TestimonialsCarousel />
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </motion.div>
  );
};

export default VisitorLandingPage;
