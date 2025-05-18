import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import NavigationBar from "../../components/visitor/NavigationBar";

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
            <h2 className="text-3xl font-bold mb-4">Our Features</h2>
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
              <p className="text-gray-600 text-center">
                Comprehensive learning materials to enhance your knowledge about
                the park and its ecosystem.
              </p>
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
              <p className="text-gray-600 text-center">
                Earn official certifications to validate your expertise as a
                park guide.
              </p>
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
              <p className="text-gray-600 text-center">
                Access detailed information about the flora and fauna within the
                park.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left side of footer */}
            <div>
              <div className="text-2xl font-bold text-green-400 mb-4">SFC</div>
              <div className="space-y-2">
                <p className="flex items-center">
                  <img
                    src="/email-icon.png"
                    alt="Email"
                    className="w-5 h-5 mr-2"
                  />{" "}
                  info@parkguide.com
                </p>
                <p className="flex items-center">
                  <img
                    src="/phone-icon.png"
                    alt="Phone"
                    className="w-5 h-5 mr-2"
                  />{" "}
                  +1 (123) 456-7890
                </p>
                <p className="flex items-center">
                  <img
                    src="/location-icon.png"
                    alt="Location"
                    className="w-5 h-5 mr-2"
                  />{" "}
                  123 Nature Park Ave
                </p>
              </div>
            </div>

            {/* Right side of footer */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Navigation</h3>{" "}
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-400 transition-colors"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => navigate("/visitor/about")}
                      className="hover:text-green-400 transition-colors"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => navigate("/visitor/info")}
                      className="hover:text-green-400 transition-colors"
                    >
                      Info
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => navigate("/visitor/map")}
                      className="hover:text-green-400 transition-colors"
                    >
                      Map
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => navigate("/visitor/feedback")}
                      className="hover:text-green-400 transition-colors"
                    >
                      Feedback
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Connect</h3>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition-colors"
                  >
                    <img
                      src="/instagram-icon.png"
                      alt="Instagram"
                      className="w-6 h-6"
                    />
                  </a>
                  <a
                    href="#"
                    className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition-colors"
                  >
                    <img
                      src="/facebook-icon.png"
                      alt="Facebook"
                      className="w-6 h-6"
                    />
                  </a>
                  <a
                    href="#"
                    className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition-colors"
                  >
                    <img
                      src="/twitter-icon.png"
                      alt="Twitter"
                      className="w-6 h-6"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 Park Guide Training and Management. All rights
              reserved.
            </p>
          </div>
        </div>{" "}
      </footer>
    </motion.div>
  );
};

export default VisitorLandingPage;
