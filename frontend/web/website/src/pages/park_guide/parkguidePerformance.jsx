import React from 'react';
import "../../ParkGuideStyle.css";
import GuideRatingRadar from '../../components/park_guide/guideRatingRadarChart';
import GuideVisitorComments from '../../components/park_guide/GuideVisitorComments';

const ParkguidePerformance = () => {
  // Placeholder data for module recommendations and reviews
  const recommendations = [
    { id: 1, module: 'Module 1: Basics of Park Guiding', reason: 'Highly requested by visitors.' },
    { id: 2, module: 'Module 3: Visitor Engagement & Safety', reason: 'Critical for improving visitor satisfaction.' },
    { id: 3, module: 'Module 2: Advanced Park Management', reason: 'Essential for team leadership and crisis management.' },
    { id: 4, module: 'Module 4: Wildlife Conservation', reason: 'Important for educating visitors about wildlife protection.' },
    { id: 5, module: 'Module 5: First Aid Training', reason: 'Vital for ensuring visitor safety during emergencies.' },
  ];
  return (
      <div className="performance-main-content">
        <div className="page-title-card">
          <h1>Performance Overview</h1>
          <p>Track your performance metrics and view personalized training recommendations.</p>
        </div>

        {/* Module Recommendations */}
        <div className="recommendations-section">
          <h2 className="boxtitle">Module Recommendations</h2>
          <ul className="recommendations-list">
            {recommendations.map((rec) => (
              <li key={rec.id} className="recommendation-item">
                <strong>{rec.module}</strong>
                <span>{rec.reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Visitor Reviews */}
        <div className="reviews-section">
          <h2 className="boxtitle">Visitor Feedback & Ratings</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-4'>
            <GuideRatingRadar />
            <GuideVisitorComments />
          </div>
        </div>

      </div>
  );
};

export default ParkguidePerformance;