import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import '../styles.css';

const moduleData = {
  'Module 1': {
    title: 'Module 1: Basics of Park Guiding',
    description: 'Learn the fundamental skills required to guide visitors through the park.',
    image: '/images/advanced_guide.png',
    video: '/videos/firstaid.mp4',
    content: `This module covers the basics of park guiding, including communication skills, park history, and visitor engagement techniques. 
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse 
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
  },
  'Module 2': {
    title: 'Module 2: Advanced Park Management',
    description: 'Master advanced techniques for managing park operations effectively.',
    image: '/images/advanced_guide.png',
    video: '/videos/advanced_navigation.mp4',
    content: `This module focuses on advanced park management techniques, including resource allocation, team leadership, and crisis management. 
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse 
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
  },
  'Module 3': {
    title: 'Module 3: Visitor Engagement & Safety',
    description: 'Understand visitor engagement strategies and safety protocols.',
    image: '/images/firstaid.jpg',
    video: '/videos/wildlife_safety.mp4',
    content: `This module emphasizes visitor engagement strategies and safety protocols to ensure a safe and enjoyable experience for all visitors. 
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse 
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
  },
};

const ParkguideModule = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the module name from the query parameter
  const queryParams = new URLSearchParams(location.search);
  const moduleName = queryParams.get('module');

  // Get the module data based on the module name
  const module = moduleData[moduleName] || {
    title: 'Module Not Found',
    description: 'The module you are looking for does not exist.',
    image: '/images/not_found.png',
    video: null,
    content: 'No content available for this module.',
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">
        <div className="module-details">
          <h2 className="module-title">{module.title}</h2>
          <img src={module.image} alt={moduleName} className="module-image-large" />
          <p className="module-description">{module.description}</p>
          {module.video && (
            <video controls className="module-video">
              <source src={module.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          <p className="module-content">{module.content}</p>
          <div className="additional-box">
            <h3 className="additional-box-title">Additional Information</h3>
            <p className="additional-box-content">
              Here you can find more resources and links related to this module. Explore further to enhance your knowledge and skills.
            </p>
          </div>
          <button className="back-button" onClick={() => navigate('/training')}>
            Back to Training Modules
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParkguideModule;