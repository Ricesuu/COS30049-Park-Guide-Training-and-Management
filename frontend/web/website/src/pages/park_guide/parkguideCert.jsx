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
        }
        const certsData = await certsResponse.json();
        setCertifications(certsData);
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
      <div className="page-title-card">
        <h1>Certification & Licensing</h1>
        <p>View and manage your professional park guide certifications. Complete training modules to earn new certifications.</p>
      </div>      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <p style={{ fontSize: '1.1rem', color: '#64748b' }}>Loading certifications...</p>
        </div>
      )}
      
      {error && (
        <div className="error-message" style={{
          textAlign: 'center',
          padding: '1rem',
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          borderRadius: '8px',
          margin: '1rem 0'
        }}>
          {error}
        </div>
      )}
      
      {!loading && certifications.length === 0 && (
        <div className="no-certs-message" style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
          border: '2px dashed #d1d5db'
        }}>
          <h3 style={{ color: '#374151', marginBottom: '1rem' }}>No Certifications Yet</h3>
          <p style={{ color: '#6b7280' }}>Complete training modules to earn your certifications</p>
        </div>
      )}
      
      {certifications.length > 0 && (
        <div className="cert-page-grid">
          {certifications.map((cert, index) => (
            <div 
              key={cert.cert_id || index}
              className="cert-page-box"
              onClick={() => handleCertificationClick(cert)}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >              <div className="cert-title-container">
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                  {cert.module_name || 'Untitled Certificate'}
                </h3>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Issued</span>
                  <span style={{ color: '#111827', fontWeight: '500' }}>{formatDate(cert.issued_date)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Expires</span>
                  <span style={{ color: '#111827', fontWeight: '500' }}>{formatDate(cert.expiry_date)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showPopup && selectedCert && (        <div className="cert-popup-overlay" onClick={closePopup}>
          <div className="cert-popup" onClick={e => e.stopPropagation()}
          >            <div className="cert-popup-header">
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                {selectedCert.module_name || 'Certificate'}
              </h3>
              <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                Professional Park Guide Certification
              </p>
            </div>
            
            <div className="cert-popup-content">
              <div style={{
                display: 'grid',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <span style={{ color: '#374151', fontWeight: '500' }}>Issued Date</span>
                  <span style={{ color: '#111827' }}>{formatDate(selectedCert.issued_date)}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <span style={{ color: '#374151', fontWeight: '500' }}>Expiry Date</span>
                  <span style={{ color: '#111827' }}>{formatDate(selectedCert.expiry_date)}</span>
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ 
                  color: '#111827', 
                  fontSize: '1.125rem', 
                  fontWeight: '600',
                  marginBottom: '1rem'
                }}>
                  Description
                </h4>
                <p style={{ 
                  color: '#4b5563',
                  lineHeight: '1.6'
                }}>
                  {selectedCert.description || 'This certificate verifies successful completion of the training module and demonstrates your expertise as a professional park guide.'}
                </p>
              </div>
                <div className="cert-popup-footer">
                <button
                  onClick={closePopup}
                  className="cert-action-button"
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151'
                  }}
                >
                  Close
                </button>
                <button className="cert-action-button view">
                  Download Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkguideCert;