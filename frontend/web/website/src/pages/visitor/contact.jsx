import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaPhone,
  FaEnvelope,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import NavigationBar from "../../components/visitor/NavigationBar";
import Footer from "../../components/visitor/Footer";
import ChatbotWidget from "../../components/visitor/ChatbotWidget";
import { API_URL } from "../../config/apiConfig";

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

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "", // 'success' or 'error'
    message: "",
  });

  // Function to show a notification
  const showNotification = (type, message) => {
    setNotification({
      show: true,
      type,
      message,
    });

    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification({
        show: false,
        type: "",
        message: "",
      });
    }, 5000);
  };

  // Notification component
  const Notification = () => {
    if (!notification.show) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed top-25 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-md shadow-lg flex items-center gap-3 max-w-md w-full mx-auto ${
          notification.type === "success"
            ? "bg-green-100 text-green-800 border-l-4 border-green-500"
            : "bg-red-100 text-red-800 border-l-4 border-red-500"
        }`}
      >
        {notification.type === "success" ? (
          <FaCheckCircle className="text-green-500 text-xl" />
        ) : (
          <FaExclamationTriangle className="text-red-500 text-xl" />
        )}
        <span>{notification.message}</span>
        <button
          onClick={() =>
            setNotification({ show: false, type: "", message: "" })
          }
          className="ml-4 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </motion.div>
    );
  };

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

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Telephone validation (optional but validate format if provided)
    if (
      formData.telephone &&
      !/^[0-9+\-\s()]{6,20}$/.test(formData.telephone)
    ) {
      errors.telephone = "Please enter a valid phone number";
    }

    // Message validation
    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message should be at least 10 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Send form data to the backend API
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Check if the response is valid JSON
      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response received:", text);
        throw new Error(
          "Server returned an unexpected response. Please try again later."
        );
      }

      if (!response.ok) {
        if (data.fields) {
          // Handle validation errors from backend
          const backendErrors = {};
          data.fields.forEach((field) => {
            backendErrors[field] = `${field} is required`;
          });
          setFormErrors(backendErrors);
          throw new Error(data.error || "Please fill in all required fields");
        } else {
          throw new Error(data.error || "Failed to submit contact form");
        }
      }

      // Clear form after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        address: "",
        telephone: "",
        email: "",
        message: "",
      });

      // Show success notification
      showNotification(
        "success",
        "Your message has been sent successfully! We'll get back to you soon."
      );
    } catch (error) {
      console.error("Error submitting contact form:", error);
      showNotification("error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen bg-white text-gray-800"
    >
      {/* Display the notification component */}
      <Notification />

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
                    Corporate Office
                  </h3>
                  <address className="not-italic text-gray-600 leading-relaxed">
                    Lot 218, KCLD, Jalan Tapang, Kota Sentosa,
                    <br />
                    93250 Kuching, Sarawak,
                    <br />
                    Malaysia
                  </address>
                </div>

                <div className="space-y-3 pb-5 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 relative after:content-[''] after:absolute after:left-0 after:bottom-[-0.3rem] after:w-8 after:h-0.5 after:bg-green-500">
                    Regional Office
                  </h3>
                  <address className="not-italic text-gray-600 leading-relaxed">
                    KM20, Semenggoh, Jalan Puncak Borneo,
                    <br />
                    93250 Kuching, Sarawak,
                    <br />
                    Malaysia
                  </address>
                </div>

                <div className="space-y-3 pb-5 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 relative after:content-[''] after:absolute after:left-0 after:bottom-[-0.3rem] after:w-8 after:h-0.5 after:bg-green-500">
                    Contact Details
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-center gap-3">
                      <FaPhone className="text-green-600" /> (+6) 082-610088
                    </p>
                    <p className="flex items-center gap-3">
                      <FaEnvelope className="text-green-600" />{" "}
                      info@sarawakforestry.com
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-800 relative after:content-[''] after:absolute after:left-0 after:bottom-[-0.3rem] after:w-8 after:h-0.5 after:bg-green-500">
                    Follow Us
                  </h3>
                  <div className="flex gap-4 text-2xl text-gray-600">
                    <a
                      href="https://www.instagram.com/sfcsarawak/?hl=en"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-green-600 transition-colors"
                      aria-label="Instagram"
                    >
                      <FaInstagram />
                    </a>
                    <a
                      href="https://www.facebook.com/sfcsarawak/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-green-600 transition-colors"
                      aria-label="Facebook"
                    >
                      <FaFacebook />
                    </a>
                    <a
                      href="https://www.linkedin.com/company/sarawak-forestry-corporation-sdn.-bhd./"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-green-600 transition-colors"
                      aria-label="LinkedIn"
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
                    {" "}
                    <div className="flex-1">
                      <label
                        htmlFor="firstName"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border ${
                          formErrors.firstName
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        } rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                        hover:border-green-300 transition-all duration-300 ease-in-out
                        bg-white hover:bg-green-50/30`}
                        disabled={isSubmitting}
                      />
                      {formErrors.firstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="flex-1">
                      <label
                        htmlFor="lastName"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border ${
                          formErrors.lastName
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        } rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                        hover:border-green-300 transition-all duration-300 ease-in-out
                        bg-white hover:bg-green-50/30`}
                        disabled={isSubmitting}
                      />
                      {formErrors.lastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>{" "}
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
                      className={`w-full px-4 py-2 border ${
                        formErrors.address
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      } rounded-md 
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                      hover:border-green-300 transition-all duration-300 ease-in-out
                      bg-white hover:bg-green-50/30`}
                      disabled={isSubmitting}
                    />
                    {formErrors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.address}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    {" "}
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
                        className={`w-full px-4 py-2 border ${
                          formErrors.telephone
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        } rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                        hover:border-green-300 transition-all duration-300 ease-in-out
                        bg-white hover:bg-green-50/30`}
                        disabled={isSubmitting}
                      />
                      {formErrors.telephone && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.telephone}
                        </p>
                      )}
                    </div>
                    <div className="flex-1">
                      <label
                        htmlFor="email"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border ${
                          formErrors.email
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        } rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                        hover:border-green-300 transition-all duration-300 ease-in-out
                        bg-white hover:bg-green-50/30`}
                        disabled={isSubmitting}
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                  </div>{" "}
                  <div className="mb-6">
                    <label
                      htmlFor="message"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="5"
                      required
                      className={`w-full px-4 py-2 border ${
                        formErrors.message
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      } rounded-md 
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                      hover:border-green-300 transition-all duration-300 ease-in-out 
                      bg-white hover:bg-green-50/30 resize-vertical`}
                      disabled={isSubmitting}
                    ></textarea>
                    {formErrors.message && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.message}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md font-medium
                    transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95
                    hover:shadow-lg active:shadow-md flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <BiLoaderAlt className="animate-spin mr-2" /> Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                  {/* Form submission note */}
                  <p className="text-gray-500 text-sm mt-4">
                    <span className="text-red-500">*</span> Required fields
                  </p>
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
      <div style={{ position: "fixed", bottom: 0, right: 0, zIndex: 9999 }}>
        <ChatbotWidget />
      </div>
    </motion.div>
  );
};

export default ContactPage;
