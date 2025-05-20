import React, { useState } from "react";
import NavigationBar from "../../components/visitor/NavigationBar";
import Footer from "../../components/visitor/Footer";
import StarRating from "../../components/visitor/StarRating";
import { motion } from "framer-motion";

const FeedbackPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    telephone: "",
    email: "",
    ticketNo: "",
    park: "",
    visitDate: new Date().toISOString().split("T")[0],
    guideName: "",
    guideNumber: "",
    languageRating: 0,
    knowledgeRating: 0,
    organizationRating: 0,
    engagementRating: 0,
    safetyRating: 0,
    feedback: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRatingChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/visitor-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          telephone: formData.telephone,
          email: formData.email,
          ticketNo: formData.ticketNo,
          park: formData.park,
          visitDate: formData.visitDate,
          guideName: formData.guideName,
          guideNumber: formData.guideNumber,
          languageRating: formData.languageRating,
          knowledgeRating: formData.knowledgeRating,
          organizationRating: formData.organizationRating,
          engagementRating: formData.engagementRating,
          safetyRating: formData.safetyRating,
          feedback: formData.feedback,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      setSubmitted(true);
      setFormData({
        firstName: "",
        lastName: "",
        telephone: "",
        email: "",
        ticketNo: "",
        park: "",
        visitDate: new Date().toISOString().split("T")[0],
        guideName: "",
        guideNumber: "",
        languageRating: 0,
        knowledgeRating: 0,
        organizationRating: 0,
        engagementRating: 0,
        safetyRating: 0,
        feedback: "",
      });
    } catch (err) {
      setError("Failed to submit feedback. Please try again.");
      console.error("Error submitting feedback:", err);
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
      <NavigationBar />
      <div className="w-full h-22 bg-emerald-900"></div>
      <section className="pt-20 py-32 bg-gray-100 w-full min-h-[90vh]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row gap-20">
            <div className="md:w-2/5 space-y-6">
              <h3 className="text-green-600 font-bold text-2xl md:text-4xl">
                Feedback
              </h3>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                We value your feedback!
              </h1>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                Here, you can provide feedback on your experience during your
                visit. You may include details on aspects such as the park you
                visited, the services you used, the park guide assigned to you,
                and so on.
              </p>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                Your response is greatly appreciated! Our team will review your
                feedback and use it to improve our services.
              </p>
            </div>
            <div className="md:w-3/5">
              <div className="bg-white p-8 rounded-lg shadow-lg">                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Feedback Form
                </h2>
                <form onSubmit={handleSubmit}>
                  <h3 className="text-lg font-semibold mb-2">
                    Personal Information
                  </h3>
                  <hr className="mb-4" />
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
                        required
                        placeholder="+60XXXXXXXXX"
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
                        placeholder="someone@example.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md 
                          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                          hover:border-green-300 transition-all duration-300 ease-in-out
                          bg-white hover:bg-green-50/30"
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-2 mt-6">
                    Visit Information
                  </h3>
                  <hr className="mb-4" />
                  <div className="mb-4">
                    <label
                      htmlFor="ticketNo"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Ticket Number
                    </label>
                    <input
                      type="text"
                      id="ticketNo"
                      name="ticketNo"
                      value={formData.ticketNo}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                        hover:border-green-300 transition-all duration-300 ease-in-out
                        bg-white hover:bg-green-50/30"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="park"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Park Name
                    </label>
                    <select
                      id="park"
                      name="park"
                      value={formData.park}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                        hover:border-green-300 transition-all duration-300 ease-in-out
                        bg-white [&>option]:bg-white"
                    >
                      <option value="">Select a park</option>
                      <option value="Bako National Park">Bako National Park</option>
                      <option value="Semenggoh Wildlife Centre">
                        Semenggoh Wildlife Centre
                      </option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="visitDate"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Visit Date
                    </label>
                    <input
                      type="date"
                      id="visitDate"
                      name="visitDate"
                      value={formData.visitDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                        hover:border-green-300 transition-all duration-300 ease-in-out
                        bg-white hover:bg-green-50/30"
                    />
                  </div>

                  <h3 className="text-lg font-semibold mb-2 mt-6">
                    Guide Information
                  </h3>
                  <hr className="mb-4" />
                  <div className="mb-4">
                    <label
                      htmlFor="guideName"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Park Guide Name
                    </label>
                    <input
                      type="text"
                      id="guideName"
                      name="guideName"
                      value={formData.guideName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                        hover:border-green-300 transition-all duration-300 ease-in-out
                        bg-white hover:bg-green-50/30"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="guideNumber"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Park Guide Number
                    </label>
                    <input
                      type="text"
                      id="guideNumber"
                      name="guideNumber"
                      value={formData.guideNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                        hover:border-green-300 transition-all duration-300 ease-in-out
                        bg-white hover:bg-green-50/30"
                    />
                  </div>

                  <h3 className="text-lg font-semibold mb-2 mt-6">Guide Ratings</h3>
                  <hr className="mb-4" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">
                        Language Proficiency
                      </label>
                      <StarRating
                        name="languageRating"
                        value={formData.languageRating}
                        onChange={handleRatingChange}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">
                        Knowledge & Expertise
                      </label>
                      <StarRating
                        name="knowledgeRating"
                        value={formData.knowledgeRating}
                        onChange={handleRatingChange}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">
                        Organization Skills
                      </label>
                      <StarRating
                        name="organizationRating"
                        value={formData.organizationRating}
                        onChange={handleRatingChange}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">
                        Engagement Level
                      </label>
                      <StarRating
                        name="engagementRating"
                        value={formData.engagementRating}
                        onChange={handleRatingChange}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">
                        Safety Awareness
                      </label>
                      <StarRating
                        name="safetyRating"
                        value={formData.safetyRating}
                        onChange={handleRatingChange}
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-2 mt-6">
                    Additional Feedback
                  </h3>
                  <hr className="mb-4" />
                  <div className="mb-6">
                    <label
                      htmlFor="feedback"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Your Feedback
                    </label>
                    <textarea
                      id="feedback"
                      name="feedback"
                      value={formData.feedback}
                      onChange={handleInputChange}
                      rows="5"
                      required                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                        hover:border-green-300 transition-all duration-300 ease-in-out 
                        bg-white hover:bg-green-50/30 resize-vertical"
                    ></textarea>
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
                      {error}
                    </div>
                  )}
                  {submitted && (
                    <div className="mb-6 p-4 bg-green-100 text-green-700 rounded">
                      Thank you for your feedback!
                    </div>
                  )}

                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md font-medium
  transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95
  hover:shadow-lg active:shadow-md"
                  >
                    Submit Feedback
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </motion.div>
  );
};

export default FeedbackPage;
