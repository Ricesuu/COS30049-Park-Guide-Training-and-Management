/***********************************************************************
 * VISITOR LANDING PAGE COMPONENT
 * Main landing page for visitors with key sections:
 * - Hero section with video background
 * - Features section highlighting key offerings
 * - Testimonials from park guides
 ***********************************************************************/
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBook, FaCertificate, FaLeaf, FaArrowRight } from "react-icons/fa";
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
      {/******************************************************************
       * HERO SECTION
       * Video background with welcome message and CTA button
       ******************************************************************/}
      <section className="pt-24 min-h-screen relative flex items-center overflow-hidden">
        {/* YouTube Video Background */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <div className="relative w-full h-full">
            {" "}
            <iframe
              className="absolute w-[150%] h-[150%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              src="https://www.youtube.com/embed/THrCxzbjaYM?autoplay=1&mute=1&controls=0&loop=1&playlist=THrCxzbjaYM&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&start=45"
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
          <h3 className="text-green-400 font-bold text-lg md:text-2xl mb-2">
            WELCOME TO
          </h3>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Park Guide Training and Management
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-200">
            Discover, Learn, and Connect with Nature
          </p>
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
            className="border border-white text-white hover:bg-green-600 hover:text-white py-3 px-8 rounded-lg font-medium text-sm md:text-base transition-colors cursor-pointer hover:border-transparent"
          >
            {isLoggedIn ? "Go to Dashboard" : "Get Started"}
          </button>
        </div>
      </section>
      {/******************************************************************
       * FEATURES SECTION
       * Highlights key features with icons and descriptions
       ******************************************************************/}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Key Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
              Everything you need to become an expert park guide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {" "}
            <div className="bg-white p-10 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex justify-center mb-6">
                <FaBook className="text-5xl text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Training Modules
              </h3>
              <p className="text-gray-600 text-center mb-5">
                Comprehensive learning materials to enhance your knowledge about
                the park and its ecosystem.
              </p>{" "}
              <div className="text-center">
                <a
                  onClick={() => navigate("/visitor/training")}
                  className="text-emerald-600 hover:text-emerald-800 font-medium inline-flex items-center cursor-pointer transition-colors"
                >
                  Learn More
                  <FaArrowRight className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>{" "}
            <div className="bg-white p-10 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex justify-center mb-6">
                <FaCertificate className="text-5xl text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Certification
              </h3>
              <p className="text-gray-600 text-center mb-5">
                Earn official certifications to validate your expertise as a
                park guide.
              </p>{" "}
              <div className="text-center">
                <a
                  onClick={() => navigate("/visitor/certification")}
                  className="text-emerald-600 hover:text-emerald-800 font-medium inline-flex items-center cursor-pointer transition-colors"
                >
                  Learn More
                  <FaArrowRight className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>{" "}
            <div className="bg-white p-10 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex justify-center mb-6">
                <FaLeaf className="text-5xl text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Plant Information
              </h3>
              <p className="text-gray-600 text-center mb-5">
                Access detailed information about the flora and fauna within the
                park.
              </p>{" "}
              <div className="text-center">
                <a
                  onClick={() => navigate("/visitor/plant-info")}
                  className="text-emerald-600 hover:text-emerald-800 font-medium inline-flex items-center cursor-pointer transition-colors"
                >
                  Learn More
                  <FaArrowRight className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/******************************************************************
       * TESTIMONIALS SECTION
       * Carousel of user testimonials from park guides
       ******************************************************************/}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
              Hear from park guides who have experienced our training program
            </p>
          </div>

          <TestimonialsCarousel />
        </div>
      </section>
      {/******************************************************************
       * FOOTER SECTION
       * Site footer with links and copyright information
       ******************************************************************/}
      <Footer />
    </motion.div>
  );
};

export default VisitorLandingPage;
