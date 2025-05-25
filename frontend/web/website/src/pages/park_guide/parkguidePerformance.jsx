import React from 'react';
import "../../ParkGuideStyle.css";
import GuideRatingRadar from '../../components/park_guide/guideRatingRadarChart';
import GuideVisitorComments from '../../components/park_guide/GuideVisitorComments';

const ParkguidePerformance = () => {

  
  return (
      <div className="performance-main-content">
        <div className="page-title-card">
          <h1>Performance Overview</h1>
          <p>Track your performance metrics and view personalized training recommendations.</p>
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