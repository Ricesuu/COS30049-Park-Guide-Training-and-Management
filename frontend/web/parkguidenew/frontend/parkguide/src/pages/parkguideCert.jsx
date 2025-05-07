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
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="cert-main-content">
        <h2 className="section-title">Certification & Licensing</h2>
        <div className="cert-grid">
          {certifications.map((cert, index) => (
            <div className="cert-box" key={index}>
              <img src={cert.image} alt={cert.title} className="cert-image" />
              <div className="cert-details">
                <h3 className="cert-title">{cert.title}</h3>
                <p className="cert-expiry">Expiry Date: {cert.expiry}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParkguideCert;