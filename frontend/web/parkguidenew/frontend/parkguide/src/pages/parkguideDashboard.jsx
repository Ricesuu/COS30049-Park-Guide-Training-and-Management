// parkguideDashboard.jsx
import React from 'react';
import Sidebar from '../components/sidebar';
import '../styles.css';

// Import images to ensure they're properly handled by Vite
import semenggohImg from '/images/Semenggoh.jpg';
import advancedGuideImg from '/images/advanced_guide.png';
import firstaidImg from '/images/firstaid.jpg';

const Dashboard = () => {
  const announcements = [
    { text: 'New training modules are now available!', priority: 'high' },
    { text: 'Certification 3 is expiring soon. Please renew.', priority: 'medium' },
    { text: 'Park maintenance scheduled for next week.', priority: 'low' },
    { text: 'New safety protocols have been implemented.', priority: 'high' },
    { text: 'Team meeting scheduled for Friday.', priority: 'medium' },
    { text: 'Visitor feedback survey is now live.', priority: 'low' },
    { text: 'Emergency drill scheduled for next month.', priority: 'high' },
    { text: 'New park zones are now open.', priority: 'medium' },
    { text: 'Annual park cleanup event is coming soon.', priority: 'low' },
  ];

  const certifications = [
    { title: 'Semenggoh Park Guide', expiry: '2025-12-31' },
    { title: 'Is it really that deep? + 2', expiry: 'In Progress' },
    { title: 'Advanced Wildlife Training', expiry: '2026-06-15' },
    { title: 'Visitor Safety Certification', expiry: '2024-09-30' },
    { title: 'Park Maintenance Basics', expiry: '2025-03-20' },
    { title: 'Wildlife Rescue Basics', expiry: '2025-08-15' },
    { title: 'Eco-Tourism Certification', expiry: '2026-01-10' },
  ];

  const performanceMetrics = {
    positiveFeedback: 80, // Example: 80% positive feedback
    negativeFeedback: 20, // Example: 20% negative feedback
    totalFeedback: 100, // Example: 100 total feedback entries
  };

  const navigate = (path) => {
    window.location.href = path;
  };

  // Use imported images instead of string paths
  const certImages = [semenggohImg, advancedGuideImg, firstaidImg];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="dashboard-main-content">
        {/* User Info Container */}
        <div className="box user-info">
          <img src="/images/Ruiziq.jpg" alt="User" className="user-photo" />
          <div className="user-details">
            <h2 className="user-name">Mohamad Haziq bin Solamee @Halmi</h2>
            <p className="user-id">ID: 102782601</p>
          </div>
        </div>

        {/* Centered Boxes */}
        <div className="centered-boxes">
          {/* Announcement Container */}
          <div className="box announcement">
            <h2 className="boxtitle">Announcements</h2>
            <ul className="announcement-list">
              {announcements.map((announcement, index) => (
                <li
                  key={index}
                  className={`announcement-item ${announcement.priority}`}
                >
                  {announcement.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Performance Container */}
          <div className="box performance">
            <h2 className="boxtitle">Performance</h2>
            <div className="performance-content">
              <p><strong>Total Feedback:</strong> {performanceMetrics.totalFeedback}</p>
              <p><strong>Positive Feedback:</strong> {performanceMetrics.positiveFeedback}%</p>
              <p><strong>Negative Feedback:</strong> {performanceMetrics.negativeFeedback}%</p>
            </div>
          </div>

          {/* Certification Section - Show only completed certs */}
          <div className="box certification">
            <h2 className="boxtitle">Your Certifications</h2>
            <div className="certification-grid">
              {certifications
                .filter(cert => cert.expiry !== 'In Progress') // Only show completed certifications
                .map((cert, index) => (
                  <div className="dashboard-cert-card" key={index} onClick={() => navigate('/certifications')}>
                    <div className="dashboard-cert-image-container">
                      <img
                        src={certImages[index % 3]}
                        alt={`Certification ${index + 1}`}
                        className="dashboard-cert-image"
                      />
                    </div>
                    <div className="dashboard-cert-info">
                      <h3 className="dashboard-cert-title">{cert.title}</h3>
                      <p className="dashboard-cert-expiry">
                        Expiry: <span>{cert.expiry}</span>
                      </p>
                    </div>
                  </div>
                ))}
            </div>
            {certifications.filter(cert => cert.expiry !== 'In Progress').length === 0 && (
              <p className="no-certs-message">You don't have any completed certifications yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
