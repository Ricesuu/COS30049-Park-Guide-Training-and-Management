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
        <h2 className="section-title">Performance Overview</h2>

        {/* Module Recommendations */}
        <div className="recommendations-section">
          <h3 className="subsection-title">Module Recommendations</h3>
          <ul className="recommendations-list">
            {recommendations.map((rec) => (
              <li key={rec.id} className="recommendation-item">
                <strong>{rec.module}</strong>: {rec.reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Visitor Reviews */}
        <div className="reviews-section">
          <div className='m-5 grid grid-cols-1 md:grid-cols-2 gap-6 items-start'>
            <GuideRatingRadar />
            <GuideVisitorComments />
          </div>
        </div>

      </div>
  );
};

export default ParkguidePerformance;