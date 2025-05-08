
import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../../ParkGuideStyle.css";

// Import images for proper loading in Vite
import advancedGuideImg from '/images/advanced_guide.png';
import wildlifeSafetyImg from '/images/wildlife_safety.jpg';
import firstAidImg from '/images/firstaid.jpg';
import semenggohImg from '/images/Semenggoh.jpg';
import ruiziqImg from '/images/Ruiziq.jpg';
import phalaenopsisImg from '/images/phalaenopsis.jpg';

const ParkguideTraining = () => {
  const navigate = useNavigate();

  const startTraining = (moduleName, event) => {
    // Prevent the event from bubbling up to parent elements
    if (event) {
      event.stopPropagation();
    }
    navigate(`/parkguideModule?module=${moduleName}`);
  };

  // Updated modules with more descriptive content and proper image imports
  const modules = [
    {
      name: 'Module 1',
      title: 'Basics of Park Guiding',
      description: 'Learn fundamental skills for guiding visitors through the park, including communication techniques and visitor management.',
      image: advancedGuideImg,
      status: 'completed',
    },
    {
      name: 'Module 2',
      title: 'Wildlife Identification',
      description: 'Master the identification of local fauna, their behaviors, habitats, and conservation status in Borneo\'s diverse ecosystem.',
      image: wildlifeSafetyImg,
      status: 'in-progress',
    },
    {
      name: 'Module 3',
      title: 'First Aid & Safety',
      description: 'Essential first aid procedures, emergency protocols, and safety measures for both guides and visitors in wilderness settings.',
      image: firstAidImg,
      status: 'not-started',
    },
    {
      name: 'Module 4',
      title: 'Conservation Principles',
      description: 'Understand conservation efforts, sustainable practices, and how to communicate these values to park visitors.',
      image: semenggohImg,
      status: 'not-started',
    },
    {
      name: 'Module 5',
      title: 'Cultural Heritage',
      description: 'Explore the cultural significance of park areas, indigenous knowledge, and respectful practices for cultural sites.',
      image: ruiziqImg,
      status: 'not-started',
    },
    {
      name: 'Module 6',
      title: 'Plant Identification',
      description: 'Learn to identify native flora, medicinal plants, and rare species found throughout Borneo\'s diverse ecosystems.',
      image: phalaenopsisImg,
      status: 'not-started',
    },
  ];

  return (
      <div className="training-main-content">
        <h1 className="training-page-title">Training Modules</h1>
        
        <p className="training-introduction">
          Welcome to the Park Guide Training Program. These modules are designed to enhance your skills and knowledge
          as a professional park guide. Complete all modules to ensure you provide the best experience for park visitors
          while maintaining safety and conservation standards.
        </p>
        
        {/* Module Grid */}
        <div className="training-module-grid">
          {modules.map((module, index) => (
            <div
              key={index}
              className="training-module-card"
            >
              <div className="training-module-image-container">
                <img src={module.image} alt={module.title} className="training-module-image" />
                {module.status === 'completed' && (
                  <div className="training-module-badge completed">Completed</div>
                )}
                {module.status === 'in-progress' && (
                  <div className="training-module-badge in-progress">In Progress</div>
                )}
              </div>
              <div className="training-module-content">
                <h3 className="training-module-title">{module.name}: {module.title}</h3>
                <p className="training-module-description">{module.description}</p>
                <button 
                  className={`training-module-button ${module.status}`}
                  onClick={(e) => startTraining(module.name, e)}
                >
                  {module.status === 'completed' ? 'Review Module' : 
                   module.status === 'in-progress' ? 'Continue Module' : 'Start Module'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
};

export default ParkguideTraining;