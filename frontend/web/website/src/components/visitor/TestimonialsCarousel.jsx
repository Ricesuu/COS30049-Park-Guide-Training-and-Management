import React, { useState, useEffect, useCallback } from "react";
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const TestimonialsCarousel = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch testimonials from the API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/visitor-feedback");

        if (!response.ok) {
          throw new Error("Failed to fetch testimonials");
        }

        const data = await response.json(); // Process the data to match our display format
        const processedData = data.map((feedback) => ({
          id: feedback.feedback_id,
          visitor_name: feedback.visitor_name || "Anonymous Visitor",
          rating: Math.max(
            1,
            Math.min(
              5,
              (feedback.language_rating +
                feedback.knowledge_rating +
                feedback.organization_rating +
                feedback.engagement_rating +
                feedback.safety_rating) /
                5
            )
          ), // Average of all ratings, normalized between 1-5
          comment: feedback.comment || "No comment provided.",
          date_submitted: feedback.submitted_at || new Date().toISOString(),
        }));

        setTestimonials(processedData);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching testimonials:", err);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Functions to navigate carousel
  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  }, [testimonials.length]);

  const prevTestimonial = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  }, [testimonials.length]);

  // Auto-advance carousel
  useEffect(() => {
    if (testimonials.length <= 1) return;

    const intervalId = setInterval(() => {
      nextTestimonial();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [nextTestimonial, testimonials.length]);

  // Render star ratings
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < rating ? "text-yellow-500" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error && testimonials.length === 0) {
    return (
      <div className="text-center text-red-500">
        <p>Unable to load testimonials. Please try again later.</p>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="text-center text-gray-500">
        <p>No testimonials available at this time.</p>
      </div>
    );
  }
  return (
    <div className="relative max-w-4xl mx-auto px-6">
      {/* Carousel navigation */}
      {testimonials.length > 1 && (
        <>
          {" "}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[100%] md:-translate-x-[150%] bg-white p-3 rounded-full shadow-md z-10 hover:bg-gray-100 transition-colors"
            aria-label="Previous testimonial"
          >
            <FaChevronLeft className="text-green-600" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[100%] md:translate-x-[150%] bg-white p-3 rounded-full shadow-md z-10 hover:bg-gray-100 transition-colors"
            aria-label="Next testimonial"
          >
            <FaChevronRight className="text-green-600" />
          </button>
        </>
      )}{" "}
      {/* Testimonial card */}
      <div className="bg-gray-50 rounded-2xl shadow-lg p-8 md:p-14 transition-all duration-500 transform w-full">
        <div className="mb-6 text-green-500">
          <FaQuoteLeft size={36} />
        </div>
        <p className="text-gray-700 text-lg md:text-xl mb-10 leading-relaxed italic">
          "{testimonials[currentIndex].comment}"
        </p>{" "}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h4 className="text-xl md:text-2xl font-semibold text-gray-800">
              {testimonials[currentIndex].visitor_name || "Anonymous User"}
            </h4>
            <div className="mt-2 mb-4 md:mb-0">
              {renderStars(testimonials[currentIndex].rating)}
            </div>
          </div>

          <div className="text-gray-500 text-sm">
            {testimonials[currentIndex].date_submitted &&
              formatDate(testimonials[currentIndex].date_submitted)}
          </div>
        </div>
      </div>
      {/* Carousel indicators */}
      {testimonials.length > 1 && (
        <div className="flex justify-center mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`mx-1 h-3 w-3 rounded-full transition-all ${
                index === currentIndex ? "bg-green-600 w-6" : "bg-gray-300"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TestimonialsCarousel;
