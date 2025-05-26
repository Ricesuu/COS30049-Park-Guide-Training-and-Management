import React, { useState, useEffect } from "react";
import NavigationBar from "../../components/visitor/NavigationBar";
import Footer from "../../components/visitor/Footer";
import ChatbotWidget from "../../components/visitor/ChatbotWidget";
import { motion } from "framer-motion";
import axios from "axios";
import { API_URL } from "../../config/apiConfig";

const InfoPage = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/plants`);
        console.log("API Response:", response.data); // For debugging
        if (response.data.success && Array.isArray(response.data.data)) {
          setPlants(response.data.data);
        } else {
          setError("Failed to fetch plant information");
        }
      } catch (err) {
        console.error("Error fetching plants:", err);
        setError(err.response?.data?.error || "Error connecting to the server");
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();

    // Setup periodic refresh every 5 minutes to check for new entries
    const refreshInterval = setInterval(fetchPlants, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

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
          <div className="flex flex-col items-center">
            <h3 className="text-green-600 uppercase tracking-wide text-lg font-semibold mb-2">
              Plant Information
            </h3>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center max-w-4xl">
              Discover Our Flora Collection
            </h1>
            <p className="text-gray-600 text-lg mb-16 text-center max-w-3xl">
              Learn about the diverse plant species in our reserve and their
              unique characteristics
            </p>{" "}
            {loading ? (
              <div className="text-center text-gray-600">
                Loading plant information...
              </div>
            ) : error ? (
              <div className="text-center text-red-600">{error}</div>
            ) : (
              <div className="space-y-24 w-full">
                {plants.map((plant, index) => (
                  <motion.div
                    key={plant.plant_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`flex flex-col ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    } gap-16 items-center`}
                  >
                    <div className="md:w-1/2">
                      <div className="rounded-lg overflow-hidden shadow-xl bg-white">
                        <img
                          src={plant.image_url}
                          alt={plant.common_name}
                          className="w-full h-[400px] object-cover"
                        />
                      </div>
                    </div>
                    <div className="md:w-1/2 space-y-6">
                      <dl className="space-y-4">
                        <div>
                          <dt className="text-gray-900 font-bold mb-1">
                            Common Name:
                          </dt>
                          <dd className="text-gray-700">{plant.common_name}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-900 font-bold mb-1">
                            Scientific Name:
                          </dt>
                          <dd className="text-gray-700 italic">
                            {plant.scientific_name}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-gray-900 font-bold mb-1">
                            Family:
                          </dt>
                          <dd className="text-gray-700">{plant.family}</dd>
                        </div>
                      </dl>
                      <div className="border-t pt-6">
                        <p className="text-gray-700 leading-relaxed">
                          {plant.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>{" "}
      </section>
      <Footer />
      <div style={{ position: "fixed", bottom: 0, right: 0, zIndex: 9999 }}>
        <ChatbotWidget />
      </div>
    </motion.div>
  );
};

export default InfoPage;
