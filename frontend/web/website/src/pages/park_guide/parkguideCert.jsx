import React, { useState, useEffect } from 'react';
import "../../ParkGuideStyle.css";
import "../../CertificationStyle.css";
import { auth } from '../../Firebase';

const formatDate = (dateString) => {
  if (!dateString) return 'Not available';
  try {
    // Parse the date and handle timezone
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';

    // Get the current date for relative date calculations
    const now = new Date();
    const diffTime = Math.abs(date - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Display relative dates for recent or upcoming dates
    if (diffDays <= 7) {
      if (date > now) {
        return `Expires in ${diffDays} days`;
      } else {
        return diffDays === 0 ? 'Today' : `${diffDays} days ago`;
      }
    }

    // For other dates, use a standard format
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone // Use local timezone
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

const ParkguideCert = () => {
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
        
        // Get guide_id first
        const guideResponse = await fetch('/api/park-guides/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!guideResponse.ok) {
          throw new Error('Failed to fetch guide information');
        }

        const guideData = await guideResponse.json();
        
        // Now fetch certifications using guide_id
        const certsResponse = await fetch(`/api/certifications/user/${guideData.guide_id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!certsResponse.ok) {
          throw new Error('Failed to fetch certifications');
        }        const certsData = await certsResponse.json();

        setCertifications(certsData.map(cert => ({
          ...cert,
          image: cert.image_url || '/images/advanced_guide.png'
        })));
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
    setSelectedCert(cert);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedCert(null);
  };

  return (
    <div className="cert-main-content">
      <h2 className="cert-page-title">Certification & Licensing</h2>
      {loading && <div className="loading-spinner">Loading certifications...</div>}
      {error && <div className="error-message">{error}</div>}
      
      {!loading && certifications.length === 0 && (
        <div className="no-certs-message">
          <p>Complete more training modules to earn certifications</p>
        </div>
      )}
      
      {certifications.length > 0 && (
        <div className="cert-page-grid">
          {certifications.map((cert, index) => (
            <div 
              key={cert.cert_id || index}
              className="cert-page-box"
              onClick={() => handleCertificationClick(cert)}
            >
              <div className="cert-page-image-container">
                <img src={cert.image} alt={cert.title} className="cert-image" />
              </div>
              <div className="cert-page-details">
                <h3 className="cert-page-title-text">{cert.module_name || 'Untitled Certificate'}</h3>
                <p className="cert-page-expiry">
                  Issued: {formatDate(cert.issued_date)}
                </p>
                <p className="cert-page-expiry">
                  Expires: {formatDate(cert.expiry_date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showPopup && selectedCert && (
        <div className="cert-popup-overlay" onClick={closePopup}>
          <div className="cert-popup" onClick={e => e.stopPropagation()}>
            <button className="cert-popup-close" onClick={closePopup}>×</button>
            <div className="cert-popup-header">
              <img
                src={selectedCert.image}
                alt={selectedCert.title}
                className="cert-popup-image"
              />
              <h3 className="cert-popup-title">
                {selectedCert.module_name || 'Certificate'}
              </h3>
            </div>
            
            <div className="cert-popup-content">
              <div className="cert-info-row">
                <span className="cert-info-label">Issued Date:</span>
                <span className="cert-info-value">{formatDate(selectedCert.issued_date)}</span>
              </div>
              <div className="cert-info-row">
                <span className="cert-info-label">Expiry Date:</span>
                <span className="cert-info-value">{formatDate(selectedCert.expiry_date)}</span>
              </div>
              <div className="cert-description">
                <h4 className="cert-description-title">Description</h4>
                <p>{selectedCert.description || 'This certificate verifies successful completion of the training module.'}</p>
              </div>
            </div>
            
            <div className="cert-popup-footer">
              <button className="cert-download-button">
                Download Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkguideCert;