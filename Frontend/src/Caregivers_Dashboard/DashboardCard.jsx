// src/components/DashboardCard.js
import React from 'react';

const DashboardCard = ({ title, value, unit, trend, zone }) => {
  const zoneColors = {
    normal: 'bg-green-200',
    warning: 'bg-yellow-200',
    danger: 'bg-red-200',
  };

  return (
    <div className={`p-4 rounded shadow-lg ${zoneColors[zone]}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-xl mt-2">{value} {unit}</p>
      <p className="text-sm text-gray-500">{trend}</p>
    </div>
  );
};

export default DashboardCard;