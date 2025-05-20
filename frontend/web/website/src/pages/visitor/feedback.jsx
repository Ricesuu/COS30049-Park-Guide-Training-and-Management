import React, { useState } from "react";
import NavigationBar from "../../components/visitor/NavigationBar";
import Footer from "../../components/visitor/Footer";
import { motion } from "framer-motion";

const FeedbackPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    telephone: "",
    email: "",
    park: "",
    guide: "",
    feedback: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({
      firstName: "",
      lastName: "",
      telephone: "",
      email: "",
      park: "",
      guide: "",
      feedback: "",
    });
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
              <h3 className="text-green-600 font-bold text-2xl md:text-4xl">Feedback</h3>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">We value your feedback!</h1>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                Here, you can provide feedback on your experience during your visit. You may include details on aspects such as the park you visited, the services you used, the park guide assigned to you, and so on.
              </p>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                Your response is greatly appreciated! Our team will review your feedback and use it to improve our services.
              </p>
            </div>
            <div className="md:w-3/5">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Feedback Form</h2>
                {submitted && (
                  <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                    Thank you for your feedback!
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1">
                      <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">First Name</label>
                      <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">Last Name</label>
                      <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1">
                      <label htmlFor="telephone" className="block text-gray-700 font-medium mb-2">Telephone</label>
                      <input type="tel" id="telephone" name="telephone" value={formData.telephone} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 mt-6">Visit Information</h3>
                  <div className="mb-4">
                    <label htmlFor="park" className="block text-gray-700 font-medium mb-2">Park Visited</label>
                    <input type="text" id="park" name="park" value={formData.park} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="guide" className="block text-gray-700 font-medium mb-2">Park Guide (if any)</label>
                    <input type="text" id="guide" name="guide" value={formData.guide} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="feedback" className="block text-gray-700 font-medium mb-2">Feedback</label>
                    <textarea id="feedback" name="feedback" value={formData.feedback} onChange={handleInputChange} rows="5" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"></textarea>
                  </div>
                  <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md font-medium transition-colors">Submit Feedback</button>
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
