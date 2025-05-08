import React from 'react';
import "../../ParkGuideStyle.css";

const ParkguidePerformance = () => {
  // Placeholder data for module recommendations and reviews
  const recommendations = [
    { id: 1, module: 'Module 1: Basics of Park Guiding', reason: 'Highly requested by visitors.' },
    { id: 2, module: 'Module 3: Visitor Engagement & Safety', reason: 'Critical for improving visitor satisfaction.' },
    { id: 3, module: 'Module 2: Advanced Park Management', reason: 'Essential for team leadership and crisis management.' },
    { id: 4, module: 'Module 4: Wildlife Conservation', reason: 'Important for educating visitors about wildlife protection.' },
    { id: 5, module: 'Module 5: First Aid Training', reason: 'Vital for ensuring visitor safety during emergencies.' },
  ];

  const reviews = [
    { id: 1, type: 'positive', content: 'The guides were very knowledgeable and friendly!' },
    { id: 2, type: 'negative', content: 'The park was not clean in some areas.' },
    { id: 3, type: 'improvement', content: 'Add more shaded rest areas for visitors.' },
    { id: 4, type: 'positive', content: 'The wildlife safety module was very informative and engaging.' },
    { id: 5, type: 'negative', content: 'The parking area needs better organization.' },
    { id: 6, type: 'improvement', content: 'Provide more detailed maps for better navigation.' },
    { id: 7, type: 'positive', content: 'The advanced park management module helped our team a lot!' },
    { id: 8, type: 'negative', content: 'Some of the video content was outdated.' },
    { id: 9, type: 'improvement', content: 'Include more interactive activities for children.' },
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
          <h3 className="subsection-title">Visitor Reviews</h3>
          <ul className="reviews-list">
            {reviews.map((review) => (
              <li key={review.id} className={`review-item ${review.type}`}>
                {review.content}
              </li>
            ))}
          </ul>
        </div>
      </div>
  );
};

export default ParkguidePerformance;