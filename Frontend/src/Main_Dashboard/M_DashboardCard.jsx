// src/Main_Dashboard/M_DashboardCard.jsx
import React from 'react';

const StatCard = ({ title, value, bgColor, textColor }) => (
  <div className={`rounded-2xl shadow p-6 flex flex-col items-center ${bgColor}`}>
    <h3 className={` text-lg font-semibold ${textColor}`}>{title}</h3>
    <p className={` text-xl font-medium mt-2 ${textColor}`}>{value}</p>
  </div>
);

const M_DashboardCard = ({ totalPatients, totalCaregivers, normal, warning, danger }) => {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">


      <StatCard title="Number of Patients" value={danger} bgColor="bg-red-200" textColor="text-red-800"   />
      <StatCard title="Number of Patients" value={warning} bgColor="bg-yellow-200" textColor="text-yellow-800" />
      <StatCard title="Number of Patients" value={normal} bgColor="bg-green-200" textColor="text-green-800" />
      <StatCard title="Total Caregivers" value={totalCaregivers} bgColor="bg-[#88E1FF]" textColor="text-Black-100" />
      <StatCard title="Total Patients" value={totalPatients} bgColor="bg-[#88E1FF]" textColor="text-black-100" />

    </div>
  );
};

export default M_DashboardCard;
