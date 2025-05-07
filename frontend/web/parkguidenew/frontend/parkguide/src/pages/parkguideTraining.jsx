// filepath: c:\Users\Owner\Documents\GitHub\COS30049-Park-Guide-Training-and-Management\frontend\web\parkguidenew\frontend\parkguide\src\pages\training.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import '../styles.css';

const Training = () => {
  const navigate = useNavigate();

  const startTraining = (moduleName) => {
    navigate(`/parkguideModule?module=${moduleName}`); // Pass the module name as a query parameter
  };

  // Example modules
  const modules = Array.from({ length: 20 }, (_, index) => ({
    name: `Module ${index + 1}`,
    description: `Description for Module ${index + 1}`,
    image: '/images/advanced_guide.png',
  }));

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="training-main-content">
        {/* Training Section */}
        <h2 className="section-title">Choose a Training Module</h2>
        <div className="row-container">
          {modules.map((module, index) => (
            <div
              key={index}
              className="module-box"
              onClick={() => startTraining(module.name)}
            >
              <img src={module.image} alt={module.name} className="module-image" />
              <p className="module-title">{module.name}</p>
              <p className="module-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Training;