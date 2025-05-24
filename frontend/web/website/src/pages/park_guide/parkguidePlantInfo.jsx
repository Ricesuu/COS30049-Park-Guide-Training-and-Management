import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/park_guide/sidebar';
import { auth } from '../../Firebase';
import "../../ParkGuideStyle.css";
import "../../PlantInfoStyle.css";

// Import plant images for proper loading in Vite
import defaultPlantImg from '/images/plant-placeholder.jpg';

const ParkguidePlantInfo = () => {
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  const [isRefreshing, setIsRefreshing] = useState(false);
  const maxRetries = 3;
  const retryDelay = 1000; // 1 second

  const fetchPlants = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const token = await user.getIdToken();
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/plantinfo`;
      console.log('Fetching plants from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      console.log('Response status:', response.status);
      
      // Handle different HTTP status codes
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Plant information not found');
        } else if (response.status === 403) {
          throw new Error('Access denied');
        } else if (response.status === 500) {
          if (retryCount < maxRetries) {
            console.log(`Retrying request (${retryCount + 1}/${maxRetries})...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return fetchPlants(retryCount + 1);
          }
          throw new Error('Server error');
        } else {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error('Invalid response format');
      }

      const data = await response.json();
      console.log('Parsed data:', data);

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch plant information');
      }

      const plantsData = data.data || [];
      console.log('Plants data:', plantsData);
      setPlants(plantsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching plants:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Function to manually refresh the plant list
  const refreshPlants = () => {
    setIsRefreshing(true);
    fetchPlants();
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  // Function to open plant details
  const openPlantDetails = (plant) => {
    setSelectedPlant(plant);
  };

  // Function to close plant details
  const closePlantDetails = () => {
    setSelectedPlant(null);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main-content">        <div className="page-title-card">
          <div className="title-section">
            <h1>Plant Information</h1>
            <button 
              onClick={refreshPlants} 
              className="refresh-button" 
              disabled={loading || isRefreshing}
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          <p>Learn about the diverse plant species found in our parks and their significance.</p>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading plant information...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="plant-grid">
            {plants.map((plant) => (
              <div
                key={plant.plant_id}
                className="plant-card"
                onClick={() => openPlantDetails(plant)}
              >
                <div className="plant-image-container">
                  <img 
                    src={plant.image_url || defaultPlantImg} 
                    alt={plant.common_name} 
                    className="plant-image"
                    onError={(e) => {
                      e.target.src = defaultPlantImg;
                      e.target.onerror = null;
                    }}
                  />
                </div>
                <div className="plant-content">
                  <h3 className="plant-name">{plant.common_name}</h3>
                  <p className="scientific-name">{plant.scientific_name}</p>
                  <p className="plant-info">{plant.family}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedPlant && (
          <div className="modal-overlay" onClick={closePlantDetails}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={closePlantDetails}>×</button>
              <h2 className="modal-title">{selectedPlant.common_name}</h2>
              <div className="modal-content">
                <div>
                  <img 
                    src={selectedPlant.image_url || defaultPlantImg} 
                    alt={selectedPlant.common_name} 
                    className="modal-image"
                    onError={(e) => {
                      e.target.src = defaultPlantImg;
                      e.target.onerror = null;
                    }}
                  />
                </div>
                <div className="modal-info">
                  <div className="info-section">
                    <h3>Scientific Name</h3>
                    <p>{selectedPlant.scientific_name}</p>
                  </div>
                  <div className="info-section">
                    <h3>Family</h3>
                    <p>{selectedPlant.family}</p>
                  </div>
                  <div className="info-section">
                    <h3>Description</h3>
                    <p>{selectedPlant.description || 'No description available.'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkguidePlantInfo;