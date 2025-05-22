import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../ParkGuideStyle.css";
import { auth } from '../../Firebase';

// Import images for proper loading in Vite
import advancedGuideImg from '/images/advanced_guide.png';
import wildlifeSafetyImg from '/images/wildlife_safety.jpg';
import firstAidImg from '/images/firstaid.jpg';
import semenggohImg from '/images/Semenggoh.jpg';
import ruiziqImg from '/images/Ruiziq.jpg';
import phalaenopsisImg from '/images/phalaenopsis.jpg';

const ParkguideTraining = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchasedModules, setPurchasedModules] = useState([]);
  const [availableModules, setAvailableModules] = useState([]);
  const [showModuleStore, setShowModuleStore] = useState(false);

  // Map of module images for both purchased and available modules
  const moduleImages = {
    'Basics of Park Guiding': advancedGuideImg,
    'Wildlife Identification': wildlifeSafetyImg,
    'First Aid & Safety': firstAidImg,
    'Conservation Principles': semenggohImg,
    'Cultural Heritage': ruiziqImg,
    'Plant Identification': phalaenopsisImg,
    'default': advancedGuideImg // Fallback image
  };

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        setLoading(true);
        // Get current auth token
        const user = auth.currentUser;
        if (!user) {
          console.error('User not authenticated');
          setError('User not authenticated');
          setLoading(false);
          return;
        }
        
        const token = await user.getIdToken();
        
        // Fetch user's purchased training modules
        const modulesResponse = await fetch('/api/training-modules/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (modulesResponse.ok) {
          const modulesData = await modulesResponse.json();
          console.log('User modules received:', modulesData);
          setPurchasedModules(modulesData || []);
        } else {
          console.error('Failed to fetch user modules');
        }
        
        // Fetch available modules for purchase
        const availableModulesResponse = await fetch('/api/training-modules/available', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (availableModulesResponse.ok) {
          const availableModulesData = await availableModulesResponse.json();
          console.log('Available modules received:', availableModulesData);
          
          // Filter out modules that are already purchased
          const notPurchasedModules = availableModulesData.filter(
            module => module.purchase_status === 'not_purchased'
          );
          
          setAvailableModules(notPurchasedModules || []);
        } else {
          console.error('Failed to fetch available modules');
        }
        
      } catch (err) {
        console.error('Error fetching module data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchModuleData();
  }, []);

  const startTraining = (moduleId, event) => {
    // Prevent the event from bubbling up to parent elements
    if (event) {
      event.stopPropagation();
    }
    navigate(`/park_guide/module?moduleId=${moduleId}`);
  };
  const purchaseModule = (moduleId, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    // Navigate to module purchase page with moduleId parameter
    navigate(`/modules/purchase/${moduleId}`);
  };

  const getModuleImage = (moduleName) => {
    // Try to match the module name with our image map
    for (const [key, image] of Object.entries(moduleImages)) {
      if (moduleName && moduleName.includes(key)) {
        return image;
      }
    }
    // Return default image if no match found
    return moduleImages['default'];
  };

  return (
      <div className="training-main-content">
        <h1 className="training-page-title">Training Modules</h1>
          <div className="training-header">
          <p className="training-introduction">
            Welcome to the Park Guide Training Program. These modules are designed to enhance your skills and knowledge
            as a professional park guide.
          </p>
          
          <div className="module-view-toggle">
            <button 
              className={`toggle-btn ${!showModuleStore ? 'active' : ''}`}
              onClick={() => setShowModuleStore(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: !showModuleStore ? '#4CAF50' : '#f0f0f0',
                color: !showModuleStore ? 'white' : '#333',
                border: 'none',
                borderRadius: '4px 0 0 4px',
                cursor: 'pointer'
              }}
            >
              My Modules
            </button>
            <button 
              className={`toggle-btn ${showModuleStore ? 'active' : ''}`}
              onClick={() => setShowModuleStore(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: showModuleStore ? '#2196F3' : '#f0f0f0',
                color: showModuleStore ? 'white' : '#333',
                border: 'none',
                borderRadius: '0 4px 4px 0',
                cursor: 'pointer'
              }}
            >
              Available Modules
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-container" style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading modules...</p>
          </div>
        ) : error ? (
          <div className="error-container" style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
            <p>Error: {error}</p>
          </div>
        ) : (
          <>
            {showModuleStore ? (              // Available modules for purchase
              <div className="training-module-store">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2>Available Training Modules</h2>
                  <button
                    onClick={() => setShowModuleStore(false)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Return to My Modules
                  </button>
                </div>
                
                {availableModules.length === 0 ? (
                  <p className="no-modules-message" style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                    No additional modules available at this time.
                  </p>
                ) : (
                  <div className="store-module-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {availableModules.map((module, index) => (
                      <div 
                        key={index} 
                        className="store-module-card" 
                        style={{ 
                          border: '1px solid #ddd', 
                          borderRadius: '8px', 
                          overflow: 'hidden',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          transition: 'transform 0.3s, box-shadow 0.3s',
                          cursor: 'pointer',
                          backgroundColor: '#fff'
                        }}
                        onClick={() => purchaseModule(module.module_id || module.id, null)}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                        }}
                      >
                        <div className="store-module-image" style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                          <div style={{ 
                            position: 'absolute', 
                            top: '10px', 
                            left: '10px', 
                            backgroundColor: (module.price === 0 || module.price === '0' || module.price === '0.00') ? '#4CAF50' : '#2196F3',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            zIndex: 1
                          }}>
                            {(module.price === 0 || module.price === '0' || module.price === '0.00') ? 'FREE' : `$${parseFloat(module.price).toFixed(2)}`}
                          </div>
                          <img 
                            src={getModuleImage(module.module_name || module.name || '')} 
                            alt={module.module_name || module.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div className="store-module-content" style={{ padding: '16px' }}>
                          <h3 style={{ margin: '0 0 8px 0' }}>{module.module_name || module.name}</h3>
                          <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#666' }}>{module.description || 'No description available.'}</p>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            marginTop: 'auto' 
                          }}>
                            <span style={{ fontWeight: 'bold', color: '#555' }}>
                              {module.difficulty && (
                                <span>Difficulty: {module.difficulty}</span>
                              )}
                            </span>
                            <button 
                              onClick={(e) => purchaseModule(module.module_id || module.id, e)}
                              style={{
                                padding: '8px 16px',
                                backgroundColor: (module.price === 0 || module.price === '0' || module.price === '0.00') ? '#4CAF50' : '#2196F3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                              }}
                            >
                              {(module.price === 0 || module.price === '0' || module.price === '0.00') ? 'Enroll Now' : 'Purchase'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (              // Purchased modules
              <div className="training-module-grid">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  
                  
                </div>
                
                {purchasedModules.length === 0 ? (
                  <div className="no-modules-container" style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                    <p style={{ marginBottom: '15px', fontSize: '16px' }}>You haven't enrolled in any modules yet.</p>
                    <button
                      onClick={() => setShowModuleStore(true)}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '12px'
                      }}
                    >
                      Browse Available Modules
                    </button>
                  </div>
                ) : (
                  <div className="module-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {purchasedModules.map((module, index) => (
                      <div
                        key={index}
                        className="training-module-card"
                        style={{ 
                          border: '1px solid #ddd', 
                          borderRadius: '8px', 
                          overflow: 'hidden',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          transition: 'transform 0.3s, box-shadow 0.3s',
                          cursor: 'pointer',
                        }}
                        onClick={() => startTraining(module.id || module.module_id, null)}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                        }}
                      >
                        <div className="training-module-image-container" style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
                          <img 
                            src={getModuleImage(module.name || module.module_name || '')} 
                            alt={module.name || module.module_name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          {(module.module_status === 'completed' || module.status === 'completed') && (
                            <div className="training-module-badge completed" style={{ 
                              position: 'absolute', 
                              top: '10px', 
                              right: '10px',
                              backgroundColor: '#4CAF50',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}>
                              Completed
                            </div>
                          )}
                          {(module.module_status === 'in progress' || module.status === 'in progress') && (
                            <div className="training-module-badge in-progress" style={{ 
                              position: 'absolute', 
                              top: '10px', 
                              right: '10px',
                              backgroundColor: '#FF9800',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}>
                              In Progress
                            </div>
                          )}
                        </div>
                        <div className="training-module-content" style={{ padding: '16px' }}>
                          <h3 className="training-module-title" style={{ margin: '0 0 8px 0' }}>{module.name || module.module_name}</h3>
                          <p className="training-module-description" style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#666' }}>{module.description || 'No description available.'}</p>
                          
                          {module.completion_percentage !== undefined && (
                            <div className="progress-bar" style={{ 
                              height: '8px', 
                              backgroundColor: '#f0f0f0', 
                              borderRadius: '4px',
                              marginBottom: '12px',
                              overflow: 'hidden'
                            }}>
                              <div 
                                style={{
                                  width: `${module.completion_percentage}%`,
                                  height: '100%',
                                  backgroundColor: '#4CAF50',
                                  borderRadius: '4px'
                                }}
                              />
                              <p style={{ fontSize: '12px', textAlign: 'center', marginTop: '4px' }}>
                                {module.completion_percentage}% Complete
                              </p>
                            </div>
                          )}
                          
                          <button 
                            className="training-module-button"
                            onClick={(e) => startTraining(module.id || module.module_id, e)}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: (module.module_status === 'completed' || module.status === 'completed') ? '#2196F3' : 
                                              (module.module_status === 'in progress' || module.status === 'in progress') ? '#FF9800' : '#4CAF50',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              width: '100%',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              transition: 'background-color 0.3s, transform 0.2s'
                            }}
                          >
                            {(module.module_status === 'completed' || module.status === 'completed') ? 'Review Module' : 
                             (module.module_status === 'in progress' || module.status === 'in progress') ? 'Continue Module' : 'Start Module'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
  );
};

export default ParkguideTraining;