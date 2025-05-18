import React from "react";

const InfoCard = ({ title, value, icon, color }) => {
  return (
    <div className={`p-4 rounded-2xl shadow-md ${color} text-white`}>
      <div className="flex items-center space-x-4">
        <div className="text-4xl">{icon}</div>
        <div>
          <h4 className="text-lg font-semibold">{title}</h4>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;