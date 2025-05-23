import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../../ParkGuideStyle.css";
import { auth } from '../../Firebase';

const ParkguideModule = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [module, setModule] = useState({
    title: 'Loading...',
    description: 'Loading module content...',
    image: null,
    video_url: null,
    course_content: null,
    quiz_id: null,
    completion_percentage: 0
  });

  const queryParams = new URLSearchParams(location.search);
  const moduleId = queryParams.get('moduleId');

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) {
          throw new Error('User not authenticated');
        }
        
        const token = await user.getIdToken();
        
        // Fetch module data including course_content and video_url
        const response = await fetch(`/api/training-modules/${moduleId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 403) {
            // Handle access denied errors specifically
            throw new Error(errorData.error || 'Access to this module is restricted');
          }
          throw new Error('Failed to fetch module data');
        }
        
        const moduleData = await response.json();
        
        // Check quiz completion status
        const quizResponse = await fetch(`/api/quiz-completions?moduleId=${moduleId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (quizResponse.ok) {
          const quizData = await quizResponse.json();
          setQuizCompleted(quizData.passed || false);
        }
        
        setModule(moduleData);
        setError(null);
      } catch (err) {
        console.error('Error fetching module:', err);
        setError(err.message);
        // Redirect to training page if access is denied
        if (err.message.includes('access') || err.message.includes('pending approval')) {
          navigate('/park_guide/training');
        }
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) {
      fetchModuleData();
    } else {
      setError('No module ID provided');
      setLoading(false);
    }
  }, [moduleId, navigate]);

  const startQuiz = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const token = await user.getIdToken();
      
      // Check if quiz is available for this module
      const quizCheckResponse = await fetch(`/api/training-modules/${moduleId}/quiz`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!quizCheckResponse.ok) {
        throw new Error('Quiz not available for this module');
      }
      
      // Redirect to quiz page if available
      navigate(`/park_guide/quiz?moduleId=${moduleId}`);
    } catch (err) {
      console.error('Error starting quiz:', err);
      setError(err.message);
    }
  };

  // Show quiz button only if module is completed and quiz not yet passed
  const canTakeQuiz = module.completion_percentage >= 100;
  const showQuizButton = canTakeQuiz && !quizCompleted;
  const showCertificateButton = canTakeQuiz && quizCompleted;
  return (
    <>
      <div className="module-main-content">
        <div className="module-details">
          {loading ? (
            <div className="loading-container" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '2rem' 
            }}>
              <div className="loading-spinner" style={{
                width: '40px',
                height: '40px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #4CAF50',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '1rem'
              }}></div>
              <p>Loading module content...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p className="error-message">{error}</p>
              <button className="back-button" onClick={() => navigate('/park_guide/training')}>
                Back to Training Modules
              </button>
            </div>
          ) : (
            <>
              <h2 className="module-title">{module.module_name}</h2>
              
              {module.image_url && (
                <img src={module.image_url} alt={module.module_name} className="module-image-large" />
              )}
              
              <p className="module-description">{module.description}</p>
              
              {module.video_url && (
                <div className="module-video">
                  <iframe
                    src={module.video_url}
                    title={module.module_name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    frameBorder="0"
                  />
                </div>
              )}
              
              <div className="module-content">
                {module.course_content && (
                  <div dangerouslySetInnerHTML={{ __html: module.course_content }} />
                )}
              </div>
              
              <div className="module-navigation">
                <button className="back-button" onClick={() => navigate('/park_guide/training')}>
                  Back to Training Modules
                </button>
                
                {showQuizButton && (
                  <button 
                    className="quiz-button" 
                    onClick={startQuiz}
                  >
                    Take Certification Quiz
                  </button>
                )}
                
                {showCertificateButton && (
                  <button 
                    className="certificate-button" 
                    onClick={() => navigate('/park_guide/certifications')}
                  >
                    View Certificate
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default ParkguideModule;