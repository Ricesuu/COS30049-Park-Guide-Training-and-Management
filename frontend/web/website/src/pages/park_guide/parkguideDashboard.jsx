// parkguideDashboard.jsx
import React, { useState, useEffect } from 'react';
import "../../ParkGuideStyle.css";
import { auth } from '../../Firebase';

// Using direct path for images
const placeholderModuleImg = '/images/advanced_guide.png'; // Placeholder for modules

// Helper function that is used in the component
const formatDateString = (dateString) => {
  if (!dateString) return 'Not available';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

const checkExpired = (dateString) => {
  if (!dateString) return false;
  const expiryDate = new Date(dateString);
  const now = new Date();
  return expiryDate < now;
};

const checkExpiringSoon = (dateString) => {
  if (!dateString) return false;
  const expiryDate = new Date(dateString);
  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);
  return expiryDate > now && expiryDate <= thirtyDaysFromNow;
};

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [guideData, setGuideData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modules, setModules] = useState([]);
  const [certifications, setCertifications] = useState([]);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) {
          throw new Error('User not authenticated');
        }
        
        const token = await user.getIdToken();
        
        // Fetch user data
        const userResponse = await fetch('/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await userResponse.json();
        setUserData(userData);

        // Get guide data
        const guideResponse = await fetch('/api/park-guides/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!guideResponse.ok) {
          throw new Error('Failed to fetch guide data');
        }

        const guideData = await guideResponse.json();
        setGuideData(guideData);

        // Get modules from guide training progress
        const modulesResponse = await fetch('/api/guide-training-progress/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const modulesData = await modulesResponse.json();
        if (!modulesResponse.ok) {
          throw new Error(modulesData.error || 'Failed to fetch training progress');
        }

        // Transform the data to match the expected format
        let formattedModules = [];
        if (modulesData && modulesData.length > 0) {
          formattedModules = modulesData.map(module => ({
            ...module,
            name: module.module_name,
            module_status: module.status,
            completion_percentage: module.status === 'completed' ? 100 : 
                                module.status === 'in progress' ? 50 : 0
          }));
        }
        setModules(formattedModules);

        // Get certifications using guide_id
        const certsResponse = await fetch(`/api/certifications/user/${guideData.guide_id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Handle certification response
        if (!certsResponse.ok) {
          // Don't throw error for 404 - just means no certifications yet
          if (certsResponse.status === 404) {
            setCertifications([]);
          } else {
            throw new Error('Failed to fetch certifications');
          }
        } else {
          const certsData = await certsResponse.json();
          setCertifications(certsData.map(cert => ({
            ...cert,
            image_url: '/images/advanced_guide.png' // Default image
          })));
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  // Helper functions are now moved to top of file

  const navigate = (path) => {
    window.location.href = path;
  };
  // Removed unused certImages array

  return (
    <div className="dashboard-main-content">
      <div className="page-title-card">
        <h1>Dashboard</h1>
        <p>Welcome to your park guide dashboard. Track your training progress and manage your certifications.</p>
      </div>

      {/* User Info Container */}
      <div className="user-info-card">
        {loading ? (
          <div className="loading-spinner">Loading user information...</div>
        ) : error ? (
          <div className="error-message">Error loading user information: {error}</div>
        ) : (
          <div className="user-details">
            <h2 className="user-name">{userData ? `${userData.first_name} ${userData.last_name}` : 'User Name Not Available'}</h2>
            <div className="user-info-grid">
              <div className="user-info-item">
                <span className="info-label">Guide ID:</span>
                <span className="info-value">{guideData?.guide_id || 'Not Available'}</span>
              </div>
              <div className="user-info-item">
                <span className="info-label">Park:</span>
                <span className="info-value">{guideData?.assigned_park || 'Unassigned'}</span>
              </div>
              <div className="user-info-item">
                <span className="info-label">Certification Status:</span>
                <span className={`info-value status-${guideData?.certification_status?.toLowerCase() || 'pending'}`}>
                  {guideData?.certification_status || 'Pending'}
                </span>
              </div>
              {userData && (
                <div className="user-info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{userData.email}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Only show content if there's no loading and no errors */}
      {!loading && !error && (
        <div className="centered-boxes">
          {/* Modules Container */}
          <div className="box module-container">
            <h2 className="boxtitle">Your Training Modules</h2>
            {modules && modules.length > 0 ? (
              <div className="modules-list">
                {modules.map((module, index) => (                  <div className="module-item" key={index}>
                      <div className="module-image-container">
                        <img 
                          src={placeholderModuleImg} 
                          alt={`Module ${index + 1}`} 
                          className="module-image"
                        />
                      </div>
                      <div className="module-content">
                        <h3>{module.name}</h3>
                        <p>{module.description}</p>                        <div className="module-status">
                          <span className={`status-${module.module_status?.toLowerCase() || 'not-started'}`}>
                            <strong>Status:</strong> {module.module_status || 'Not Started'}
                          </span>
                          {module.completion_percentage && (
                            <div className="progress-bar">
                              <div 
                                className="progress" 
                                style={{width: `${module.completion_percentage}%`}}
                              ></div>
                              <span>{module.completion_percentage}% Complete</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="no-modules-message">
                <p>You don't have any training modules yet.</p>
              </div>
            )}          </div>

          {/* Certification Section */}
          <div className="box certification">
            <h2 className="boxtitle">Your Certifications</h2>
            {certifications && certifications.length > 0 ? (
              <div className="certification-grid">
                {certifications.map((cert, index) => (
                  <div 
                    className="dashboard-cert-card" 
                    key={cert.cert_id || index} 
                    onClick={() => navigate('/park_guide/certifications')}
                  >
                    <div className="dashboard-cert-image-container">
                      <img
                        src={cert.image_url}
                        alt={cert.module_name || `Certification ${index + 1}`}
                        className="dashboard-cert-image"
                      />
                      <div className={`cert-status-badge ${                          checkExpired(cert.expiry_date) ? 'expired' : 
                          checkExpiringSoon(cert.expiry_date) ? 'expiring-soon' : 'active'
                        }`}>                          {checkExpired(cert.expiry_date) ? 'Expired' : 
                           checkExpiringSoon(cert.expiry_date) ? 'Expiring Soon' : 'Active'}
                      </div>
                    </div>
                    <div className="dashboard-cert-info">
                      <h3 className="dashboard-cert-title">{cert.module_name || 'Untitled Certificate'}</h3>                        <p className="dashboard-cert-expiry">
                        Issued: {formatDateString(cert.issued_date)}
                      </p>
                      <p className={`dashboard-cert-expiry ${checkExpired(cert.expiry_date) ? 'expired' : ''}`}>
                        Expires: {formatDateString(cert.expiry_date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-certs-message">
                <p>Complete training modules to earn certifications</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
