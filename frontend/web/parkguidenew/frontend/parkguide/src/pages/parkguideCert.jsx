import React from 'react';
import Sidebar from '../components/sidebar';
import '../styles.css';

const certifications = Array.from({ length: 12 }, (_, index) => ({
  title: `Certification ${index + 1}`,
  expiry: '2025-12-31',
  image: '/images/advanced_guide.png',
}));

const ParkguideCert = () => {
  return (
    <div className="cert-page-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="cert-page-container">
        
          <h2 className="cert-page-title">Certification & Licensing</h2>
          <div className="cert-page-grid">
            {certifications.map((cert, index) => (
              <div className="cert-page-box" key={index}>
                <img src={cert.image} alt={cert.title} className="cert-page-image" />
                <div className="cert-page-details">
                  <h3 className="cert-page-title-text">{cert.title}</h3>
                  <p className="cert-page-expiry">Expiry Date: {cert.expiry}</p>
                </div>
              </div>
            ))}
          </div>
        
      </div>
    </div>
  );
};

export default ParkguideCert;