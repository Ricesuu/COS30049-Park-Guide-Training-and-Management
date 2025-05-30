import React, { useState } from 'react';

const StarRating = ({ name, value, onChange }) => {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="flex space-x-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(name, star)}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
          className={`text-2xl transform 
            ${(hoverValue >= star || value >= star) ? "text-yellow-400" : "text-gray-300"}
            ${hoverValue >= star ? "scale-125" : ""}
            hover:text-yellow-400 hover:scale-125 active:scale-95 
            transition-all duration-200 ease-in-out
            relative after:content-['★'] after:absolute after:left-0 after:top-0 
            after:opacity-0 after:text-yellow-300 
            after:transition-opacity after:duration-300
            hover:after:opacity-100
          `}
          aria-label={`Rate ${star} out of 5 stars`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default StarRating;
