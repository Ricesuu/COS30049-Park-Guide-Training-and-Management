// parkguideDashboard.jsx
import React from 'react';
import Sidebar from '../components/sidebar';
import '../styles.css';

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

          {/* Certification Section */}
          <div className="box certification">
            <h2 className="boxtitle">Certifications</h2>
            <div className="certification-content">
              {certifications.map((cert, index) => (
                <div className="cert-box" key={index}>
                  <img
                    src={index % 2 === 0 ? '/images/Semenggoh.jpg' : '/images/advanced_guide.png'}
                    alt={`Certification ${index + 1}`}
                    className="cert-image"
                  />
                  <div>
                    <h3 className="cert-title">{cert.title}</h3>
                    <p className="cert-expiry">Expiry: {cert.expiry}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
