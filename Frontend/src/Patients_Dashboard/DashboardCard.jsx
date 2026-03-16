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
      {/* Example inside DashboardCard component */}
      <div className="flex items-center mt-2 h-6">
        <span
          className={`mr-1 ${trend?.direction === 'up' ? 'text-red-600' : trend?.direction === 'down' ? 'text-green-600' : 'text-gray-600'}`}
        >
          {trend?.direction === 'up' ? '⬆️' : trend?.direction === 'down' ? '⬇️' : '➖'}
        </span>
        <span className="text-sm font-bold">{trend?.change}%</span>
      </div>
    </div>
  );
};

export default DashboardCard;