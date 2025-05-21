import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaPhone,
  FaEnvelope,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
} from "react-icons/fa";
import NavigationBar from "../../components/visitor/NavigationBar";
import Footer from "../../components/visitor/Footer";

/***********************************************************************
 * CONTACT PAGE COMPONENT
 * Provides contact information and a contact form for users
 ***********************************************************************/
const ContactPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    telephone: "",
    email: "",
    message: "",
  });

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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send the form data to a server here
    console.log("Form submitted:", formData);
    // Clear form after submission
    setFormData({
      firstName: "",
      lastName: "",
      address: "",
      telephone: "",
      email: "",
      message: "",
    });
    // Show success message (in a real app, use a proper notification system)
    alert("Your message has been sent successfully!");
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

      {/* Dark banner to improve navbar visibility */}
      <div className="w-full h-22 bg-emerald-900"></div>

      {/******************************************************************
       * CONTACT CONTENT SECTION
       * Main section with contact information and form
       ******************************************************************/}
      <section className="pt-20 py-32 bg-gray-100 w-full min-h-[90vh]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row gap-20">
            {/* Left Column - Contact Information */}
            <div className="md:w-2/5 space-y-8">
              <div className="space-y-4">
                <h3 className="text-green-600 font-bold text-2xl md:text-4xl">
                  GET IN TOUCH
                </h3>
                <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                  Have questions about our park guide program? Want to learn
                  more about conservation efforts? Feel free to reach out to us
                  using the contact information below or by filling out the
                  form.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3 pb-5 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 relative after:content-[''] after:absolute after:left-0 after:bottom-[-0.3rem] after:w-8 after:h-0.5 after:bg-green-500">
                    Office Address
                  </h3>
                  <address className="not-italic text-gray-600 leading-relaxed">
                    123 Conservation Way
                    <br />
                    Nature Park, VIC 3000
                    <br />
                    Australia
                  </address>
                </div>

                <div className="space-y-3 pb-5 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 relative after:content-[''] after:absolute after:left-0 after:bottom-[-0.3rem] after:w-8 after:h-0.5 after:bg-green-500">
                    Headquarters
                  </h3>
                  <address className="not-italic text-gray-600 leading-relaxed">
                    456 Environmental Boulevard
                    <br />
                    Green City, VIC 3001
                    <br />
                    Australia
                  </address>
                </div>

                <div className="space-y-3 pb-5 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 relative after:content-[''] after:absolute after:left-0 after:bottom-[-0.3rem] after:w-8 after:h-0.5 after:bg-green-500">
                    Contact Details
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-center gap-3">
                      <FaPhone className="text-green-600" /> +61 3 1234 5678
                    </p>
                    <p className="flex items-center gap-3">
                      <FaEnvelope className="text-green-600" />{" "}
                      contact@parkguidetraining.com
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-800 relative after:content-[''] after:absolute after:left-0 after:bottom-[-0.3rem] after:w-8 after:h-0.5 after:bg-green-500">
                    Follow Us
                  </h3>
                  <div className="flex gap-4 text-2xl text-gray-600">
                    <a
                      href="#"
                      className="hover:text-green-600 transition-colors"
                    >
                      <FaInstagram />
                    </a>
                    <a
                      href="#"
                      className="hover:text-green-600 transition-colors"
                    >
                      <FaFacebook />
                    </a>
                    <a
                      href="#"
                      className="hover:text-green-600 transition-colors"
                    >
                      <FaLinkedin />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="md:w-3/5">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1">
                      <label
                        htmlFor="firstName"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                      hover:border-green-300 transition-all duration-300 ease-in-out
                      bg-white hover:bg-green-50/30"
                      />
                    </div>
                    <div className="flex-1">
                      <label
                        htmlFor="lastName"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                      hover:border-green-300 transition-all duration-300 ease-in-out
                      bg-white hover:bg-green-50/30"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="address"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md 
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                    hover:border-green-300 transition-all duration-300 ease-in-out
                    bg-white hover:bg-green-50/30"
                    />
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1">
                      <label
                        htmlFor="telephone"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Telephone
                      </label>
                      <input
                        type="tel"
                        id="telephone"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                      hover:border-green-300 transition-all duration-300 ease-in-out
                      bg-white hover:bg-green-50/30"
                      />
                    </div>
                    <div className="flex-1">
                      <label
                        htmlFor="email"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                      hover:border-green-300 transition-all duration-300 ease-in-out
                      bg-white hover:bg-green-50/30"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="message"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="5"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md 
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                    hover:border-green-300 transition-all duration-300 ease-in-out 
                    bg-white hover:bg-green-50/30 resize-vertical"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md font-medium
                    transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95
                    hover:shadow-lg active:shadow-md"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/******************************************************************
       * FOOTER SECTION
       ******************************************************************/}
      <Footer />
    </motion.div>
  );
};

export default ContactPage;
