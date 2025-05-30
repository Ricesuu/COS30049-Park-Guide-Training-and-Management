// src/pages/visitor/about.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaTree,
  FaLeaf,
  FaBinoculars,
  FaChalkboardTeacher,
} from "react-icons/fa";
import NavigationBar from "../../components/visitor/NavigationBar";
import Footer from "../../components/visitor/Footer";
import ChatbotWidget from "../../components/visitor/ChatbotWidget";

/***********************************************************************
 * ABOUT PAGE COMPONENT
 ***********************************************************************/
const AboutPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

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
      {/******************************************************************
       * NAVIGATION BAR SECTION
       ******************************************************************/}
      <NavigationBar
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        logoutUser={logoutUser}
      />

      {/******************************************************************
       * HERO SECTION
       * Main introductory section with heading, description and image
       ******************************************************************/}
      <section className="pt-32 py-20 bg-emerald-900 text-white w-full">
        {" "}
        <div className="w-full flex flex-col md:flex-row items-center gap-12 px-5 md:px-25">
          <div className="md:w-1/2 space-y-4">
            <div className="space-y-3">
              {" "}
              <h3 className="text-yellow-300 font-bold text-lg md:text-2xl">
                ABOUT US
              </h3>{" "}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                Sarawak Forestry Corporation (SFC)
              </h2>
              <p className="text-gray-200 leading-tight text-base md:text-lg">
                Sarawak Forestry Corporation (SFC) is a statutory body under the
                Sarawak Government responsible for managing Totally Protected
                Areas (TPAs) and conserving biodiversity. Governed by relevant
                ordinances, SFC plays a key role in protecting wildlife and
                promoting sustainable eco-tourism across Sarawak.
              </p>{" "}
              <button
                onClick={() => navigate("/visitor/contact")}
                className="mt-2 inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Contact Us
              </button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1615982513414-d287e6b70ad6?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Nature Reserve"
              className="w-full h-auto rounded-lg shadow-xl object-cover max-h-[600px]"
            />
          </div>{" "}
        </div>
      </section>

      {/******************************************************************
       * ATTRACTIONS SECTION
       * Showcases the park's key attractions with icon cards
       ******************************************************************/}
      <section className="py-16 bg-white w-full">
        <div className="w-full px-5 md:px-25">
          {" "}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Attractions Highlights
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-base md:text-lg">
              Discover the unique features and experiences Sarawak Forestry
              Corporation has to offer.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {" "}
            <div className="bg-gray-50 p-10 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex justify-center mb-6">
                <FaTree className="text-4xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                National Parks & Nature Reserves
              </h3>
              <p className="text-gray-600 text-base">
                Explore Sarawak’s breathtaking national parks and nature
                reserves, home to diverse ecosystems and unique wildlife.
              </p>
            </div>{" "}
            <div className="bg-gray-50 p-10 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex justify-center mb-6">
                <FaChalkboardTeacher className="text-4xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Licensed Park Guides
              </h3>
              <p className="text-gray-600 text-base">
                Benefit from the expertise of our licensed park guides, trained
                to provide insightful and educational tours.
              </p>
            </div>{" "}
            <div className="bg-gray-50 p-10 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex justify-center mb-6">
                <FaBinoculars className="text-4xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Protected Animals
              </h3>
              <p className="text-gray-600 text-base">
                Witness Sarawak’s protected animal species in their natural
                habitats, safeguarded through our conservation efforts.
              </p>
            </div>{" "}
            <div className="bg-gray-50 p-10 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex justify-center mb-6">
                <FaLeaf className="text-4xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Eco-Tourism Programs
              </h3>
              <p className="text-gray-600 text-base">
                Participate in our eco-tourism programs designed to promote
                sustainable travel and environmental awareness.
              </p>
            </div>{" "}
          </div>
        </div>
      </section>

      {/******************************************************************
       * MISSION SECTION
       * States the organization's mission and purpose
       ******************************************************************/}
      <section className="py-16 bg-green-50 w-full">
        <div className="w-full px-5 md:px-25">
          {" "}
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
              Our Mission
            </h2>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              To safeguard Sarawak’s rich biodiversity through professional
              management of TPAs, effective wildlife protection, and innovative
              conservation efforts—empowering communities and future generations
              through education, awareness, and sustainable eco-tourism
              development.
            </p>
          </div>
        </div>
      </section>

      {/******************************************************************
       * CORE VALUES SECTION
       * Displays the organization's guiding principles
       ******************************************************************/}
      <section className="py-16 bg-white w-full">
        <div className="w-full px-5 md:px-25">
          {" "}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-base md:text-lg">
              The principles that guide our work and shape our approach to
              conservation
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {" "}
            <div className="p-8 border-l-4 border-green-500 bg-white shadow-lg rounded-r-lg">
              <h3 className="text-xl font-semibold mb-4">Stewardship</h3>
              <p className="text-gray-600 text-base">
                Committed to preserving nature for future generations through
                responsible conservation practices.
              </p>
            </div>{" "}
            <div className="p-8 border-l-4 border-green-500 bg-white shadow-lg rounded-r-lg">
              <h3 className="text-xl font-semibold mb-4">Professionalism</h3>
              <p className="text-gray-600 text-base">
                Delivering results with integrity, scientific rigor, and a
                modern management approach.
              </p>
            </div>{" "}
            <div className="p-8 border-l-4 border-green-500 bg-white shadow-lg rounded-r-lg">
              <h3 className="text-xl font-semibold mb-4">
                Community Engagement
              </h3>
              <p className="text-gray-600 text-base">
                Collaborating with stakeholders and communities to foster
                awareness and shared responsibility.
              </p>
            </div>{" "}
          </div>
        </div>
      </section>

      {/******************************************************************
       * FOOTER SECTION
       ******************************************************************/}
      <Footer />
      <div style={{ position: "fixed", bottom: 0, right: 0, zIndex: 9999 }}>
        <ChatbotWidget />
      </div>
    </motion.div>
  );
};

export default AboutPage;
