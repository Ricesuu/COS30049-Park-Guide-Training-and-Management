import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import '../styles.css';

const certifications = Array.from({ length: 12 }, (_, index) => ({
  title: `Certification ${index + 1}`,
  expiry: '2025-12-31',
  image: '/images/advanced_guide.png',
  isPaid: index % 2 === 0, // Example condition for paid/free
  isCompleted: index % 3 === 0, // Example condition for completed/incomplete
  description: `This certification validates proficiency in essential skills and knowledge required for park guides in Borneo's unique biodiversity hotspots. It covers wildlife identification, conservation protocols, visitor management techniques, and safety procedures specific to ${index + 1} level guides.`,
  issuedBy: 'Sarawak Forestry Corporation',
  issuedDate: '2024-05-01',
}));

const ParkguideCert = () => {
  const navigate = useNavigate();
  const [selectedCert, setSelectedCert] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleCertificationClick = (cert) => {
    if (cert.isCompleted) {
      // Show popup with certificate details
      setSelectedCert(cert);
      setShowPopup(true);
    } else if (!cert.isPaid) {
      // Redirect to payment page if not paid
      navigate(`/payment?cert=${cert.title}`);
    } else {
      // Redirect to quiz page if paid but not completed
      navigate(`/quiz?cert=${cert.title}`);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedCert(null);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="cert-main-content">
        <h2 className="cert-page-title">Certification & Licensing</h2>
        <div className="cert-page-grid">
          {certifications.map((cert, index) => (
            <div
              className={`cert-page-box ${cert.isCompleted ? 'completed' : ''}`}
              key={index}
              onClick={() => handleCertificationClick(cert)}
            >
              <img src={cert.image} alt={cert.title} className="cert-page-image" />
              <div className="cert-page-details">
                <h3 className="cert-page-title-text">{cert.title}</h3>
                <p className="cert-page-expiry">Expiry Date: {cert.expiry}</p>
                {cert.isCompleted && <div className="cert-completed-badge">Completed</div>}
                {!cert.isPaid && !cert.isCompleted && <div className="cert-unpaid-badge">Payment Required</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Certificate Details Popup */}
        {showPopup && selectedCert && (
          <div className="cert-popup-overlay" onClick={closePopup}>
            <div className="cert-popup" onClick={(e) => e.stopPropagation()}>
              <button className="cert-popup-close" onClick={closePopup}>×</button>
              <div className="cert-popup-header">
                <img src={selectedCert.image} alt={selectedCert.title} className="cert-popup-image" />
                <h2 className="cert-popup-title">{selectedCert.title}</h2>
              </div>
              <div className="cert-popup-content">
                <div className="cert-info-row">
                  <span className="cert-info-label">Status:</span>
                  <span className="cert-info-value completed">Active</span>
                </div>
                <div className="cert-info-row">
                  <span className="cert-info-label">Issued By:</span>
                  <span className="cert-info-value">{selectedCert.issuedBy}</span>
                </div>
                <div className="cert-info-row">
                  <span className="cert-info-label">Issue Date:</span>
                  <span className="cert-info-value">{selectedCert.issuedDate}</span>
                </div>
                <div className="cert-info-row">
                  <span className="cert-info-label">Expiry Date:</span>
                  <span className="cert-info-value">{selectedCert.expiry}</span>
                </div>
                <div className="cert-description">
                  <h3 className="cert-description-title">Description</h3>
                  <p>{selectedCert.description}</p>
                </div>
              </div>
              <div className="cert-popup-footer">
                <button className="cert-download-button">Download Certificate</button>
                <button className="cert-renew-button">Renew Certificate</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkguideCert;