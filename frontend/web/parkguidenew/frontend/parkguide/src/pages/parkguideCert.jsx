import React from 'react';
import Sidebar from '../components/sidebar';
import '../styles.css';

const certifications = [
  {
    title: 'Semenggoh Park Guide',
    expiry: '2025-12-31',
    image: '/images/Semenggoh.jpg',
    status: 'Valid',
  },
  {
    title: 'Certification 2',
    expiry: 'In Progress',
    image: '/images/cert2.png',
    status: 'In Progress',
  },
  {
    title: 'Certification 3',
    expiry: '2024-06-15',
    image: '/images/cert3.png',
    status: 'Expiring Soon',
  },
];

const ParkguideCert = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">
        <div className="cert-section">
          <h2 className="section-title">Certification & Licensing</h2>
          <div className="cert-grid">
            {certifications.map((cert, index) => (
              <div className="cert-box" key={index}>
                <img src={cert.image} alt={cert.title} className="cert-image" />
                <div>
                  <h3 className="cert-title">{cert.title}</h3>
                  <p className="cert-expiry">Expiry: {cert.expiry}</p>
                  <p className={`cert-status ${cert.status.toLowerCase().replace(' ', '-')}`}>
                    Status: {cert.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkguideCert;