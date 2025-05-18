// parkguideDashboard.jsx
import React, { useState, useEffect } from 'react';
import "../../ParkGuideStyle.css";
import { auth } from '../../Firebase';

// Import images to ensure they're properly handled by Vite
import semenggohImg from '/images/Semenggoh.jpg';
import advancedGuideImg from '/images/advanced_guide.png';
import firstaidImg from '/images/firstaid.jpg';
import placeholderModuleImg from '/images/advanced_guide.png'; // Placeholder for modules



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
        // Get current auth token
        const user = auth.currentUser;
        if (!user) {
          console.error('User not authenticated');
          setError('User not authenticated');
          setLoading(false);
          return;
        }
        
        const token = await user.getIdToken();
        
        // Fetch user data
        const userResponse = await fetch('/api/users/'+user.uid, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
          const userData = await userResponse.json();
        console.log('User data received:', userData);
        setUserData(userData);
        
        // Fetch park guide data
        const guideResponse = await fetch('/api/park-guides/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!guideResponse.ok) {
          throw new Error('Failed to fetch guide data');
        }
        
        const guideData = await guideResponse.json();
        console.log('Guide data received:', guideData);
        setGuideData(guideData);
        
        // Fetch training modules
        const modulesResponse = await fetch('/api/training-modules/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (modulesResponse.ok) {
          const modulesData = await modulesResponse.json();
          console.log('Modules data received:', modulesData);
          setModules(modulesData || []);
        }
        
        // Fetch certifications
        const certificationsResponse = await fetch('/api/certifications/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (certificationsResponse.ok) {
          const certificationsData = await certificationsResponse.json();
          console.log('Certifications data received:', certificationsData);
          setCertifications(certificationsData || []);
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
      fetchUserData();  }, []);

  const navigate = (path) => {
    window.location.href = path;
  };

  // Use imported images instead of string paths
  const certImages = [semenggohImg, advancedGuideImg, firstaidImg];

  return (
      <div className="dashboard-main-content">
        {/* User Info Container */}
        <div className="box user-info">
          {loading ? (
            <p>Loading user information...</p>
          ) : error ? (
            <p>Error loading user information: {error}</p>          ) : (
            <>
              
                <div className="user-details" style={{textAlign: 'center'}}>
                <h2 className="user-name">{userData ? `${userData.first_name} ${userData.last_name}` : 'User Name Not Available'}</h2>
                <p className="user-id">Guide ID: {guideData?.guide_id || 'Not Available'}</p>                <p className="user-park">Park: {guideData?.assigned_park || 'Unassigned'}</p>
                <p className="user-cert-status">Certification Status: {guideData?.certification_status || 'Pending'}</p>
                {userData && (
                  <p className="user-email">Email: {userData.email}</p>
                )}
              </div>
            </>
          )}        </div>        {/* Only show content if there's no loading and no errors */}
        {!loading && !error && (          <div className="centered-boxes">
            {/* Modules Container */}
            <div className="box module-container" style={{ flex: 1, maxWidth: '48%' }}>
              <h2 className="boxtitle">Your Training Modules</h2>
              {modules && modules.length > 0 ? (
                <div className="modules-list">
                  {modules.map((module, index) => (
                    <div className="module-item" key={index}>                      <div className="module-image-container" style={{ height: '120px', maxWidth: '180px', margin: '0 auto 15px auto' }}>
                        <img 
                          src={placeholderModuleImg} 
                          alt={`Module ${index + 1}`} 
                          className="module-image" 
                          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                      </div>
                      <div className="module-content">
                        <h3>{module.name}</h3>
                        <p>{module.description}</p>
                        <div className="module-status">
                          <span><strong>Status:</strong> {module.module_status || 'In Progress'}</span>
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
                <p className="no-modules-message">You don't have any training modules yet.</p>
              )}            </div>

            {/* Certification Section */}
            <div className="box certification" style={{ flex: 1, maxWidth: '48%' }}>
              <h2 className="boxtitle">Your Certifications</h2>              {certifications && certifications.length > 0 ? (
                <div className="certification-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>                  {certifications.map((cert, index) => (
                    <div className="dashboard-cert-card" key={index} onClick={() => navigate('/certifications')}>
                      <div className="dashboard-cert-image-container">
                        <img
                          src={certImages[index % certImages.length]}
                          alt={`Certification ${index + 1}`}
                          className="dashboard-cert-image"
                        />
                      </div>
                      <div className="dashboard-cert-info">
                        <h3 className="dashboard-cert-title">{cert.module_name}</h3>
                        <p className="dashboard-cert-expiry">
                          Expiry: <span>{new Date(cert.expiry_date).toLocaleDateString()}</span>
                        </p>
                        <p className="dashboard-cert-issued">
                          Issued: <span>{new Date(cert.issued_date).toLocaleDateString()}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-certs-message">You don't have any completed certifications yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
  );
};

export default Dashboard;
