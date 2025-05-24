import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../ParkGuideStyle.css";
import { auth } from '../../Firebase';

const ParkguideCert = () => {
  const navigate = useNavigate();
  const [selectedCert, setSelectedCert] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) {
          throw new Error('User not authenticated');
        }
        
        const token = await user.getIdToken();
        
        // Fetch purchased modules first
        const modulesResponse = await fetch('/api/training-modules/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!modulesResponse.ok) {
          throw new Error('Failed to fetch purchased modules');
        }

        const purchasedModules = await modulesResponse.json();

        // For each purchased module, fetch its quiz completion status
        const modulesWithStatus = await Promise.all(purchasedModules.map(async (module) => {
          const quizResponse = await fetch(`/api/quizattempts?moduleId=${module.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          const quizData = await quizResponse.json();

          return {
            id: module.id,
            title: module.module_name || module.name,
            description: module.description,
            image: module.image_url || '/images/advanced_guide.png',
            isCompleted: quizData.passed || false,
            isPaid: true,
            expiry: quizData.passed ? quizData.expiry_date : null,
            issuedBy: 'Sarawak Forestry Corporation',
            issuedDate: quizData.passed ? quizData.completion_date : null
          };
        }));

        setCertifications(modulesWithStatus);
        setError(null);
      } catch (err) {
        console.error('Error fetching certifications:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  const handleCertificationClick = (cert) => {
    if (cert.isCompleted) {
      setSelectedCert(cert);
      setShowPopup(true);
    } else {
      // Redirect to quiz page for the module
      navigate(`/park_guide/quiz?moduleId=${cert.id}`);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedCert(null);
  };

  return (
      <div className="cert-main-content">
        <h2 className="cert-page-title">Certification & Licensing</h2>
        {loading && <p>Loading certifications...</p>}
        {error && <p className="error-message">{error}</p>}
        
        {certifications.length === 0 ? (
          <div className="no-certs-message">
            <p>No certifications available. Purchase and complete training modules to earn certifications.</p>
          </div>
        ) : (
          <div className="cert-page-grid">
            {certifications.map((cert, index) => (
              <div
                className={`cert-page-box ${cert.isCompleted ? 'completed' : 'locked'}`}
                key={index}
                onClick={() => handleCertificationClick(cert)}
              >
                <div className="cert-page-overlay">
                  <img src={cert.image} alt={cert.title} className="cert-page-image" />
                  {!cert.isCompleted && (
                    <div className="cert-page-lock">
                      <i className="fas fa-lock"></i>
                      <span>Complete Quiz to Unlock</span>
                    </div>
                  )}
                </div>
                <div className="cert-page-details">
                  <h3 className="cert-page-title-text">{cert.title}</h3>
                  <p className="cert-page-expiry">
                    {cert.isCompleted ? `Expiry Date: ${cert.expiry || 'N/A'}` : 'Take Quiz to Earn Certificate'}
                  </p>
                  {cert.isCompleted && <div className="cert-completed-badge">Completed</div>}
                </div>
              </div>
            ))}
          </div>
        )}

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
                  <span className="cert-info-value">{selectedCert.issuedDate || 'N/A'}</span>
                </div>
                <div className="cert-info-row">
                  <span className="cert-info-label">Expiry Date:</span>
                  <span className="cert-info-value">{selectedCert.expiry || 'N/A'}</span>
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
  );
};

export default ParkguideCert;