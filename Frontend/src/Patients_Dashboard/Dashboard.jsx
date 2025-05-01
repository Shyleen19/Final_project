// src/components/Dashboard.js
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar.jsx';
import DashboardCard from './DashboardCard.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';


const Dashboard = () => {

  
  const [name, setName] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    console.log({"token":token})
    if(!token) {
      navigate('/login')
    } else {
      setName(localStorage.getItem('name' || ''))
    }
  })
  const metrics = [
    { title: 'Oxygen Saturation', value: '80/120', unit: 'mmHg', trend: '↑ 2.1%', zone: 'warning' },
    { title: 'Respiratory Rate', value: '36.6', unit: '', trend: '↑ 1.1%', zone: 'normal' },
    { title: 'Blood Pressure', value: '80/120', unit: 'mmHg', trend: '↑ 2.1%', zone: 'danger' },
    { title: 'Sleep Analysis', value: '6.5', unit: 'Hours', trend: '↑ 2.1%', zone: 'normal' },
    { title: 'Activity Tracking', value: '80/120', unit: 'mmHg', trend: '↑ 2.1%', zone: 'warning' },
    { title: 'Heart Rate', value: '83', unit: 'bpm', trend: '↑ 2.1%', zone: 'danger' },
    { title: 'Temperature', value: '36.6', unit: '', trend: '↑ 1.1%', zone: 'normal' },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-[#EDFCFF] p-10">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center mr-12">
            <span className="text-xl mr-12">05:10:10</span>
            <FontAwesomeIcon icon={faBell} className="text-xl "  /> {/* Notification bell icon */}
          </div>
        </header>
        
        <p className="text-xl mt-2">Welcome back {name}</p>
        {/* Color Code Legend */}
        <div className="flex space-x-24 mt-5 ">
          <div className="flex items-center">
            <div className="w-16 h-8 bg-green-500 rounded-sm"></div>
            <span className="ml-2">Normal Range</span>
          </div>
          <div className="flex items-center">
            <div className="w-16 h-8 bg-yellow-500 rounded-sm"></div>
            <span className="ml-2">Warning Zone</span>
          </div>
          <div className="flex items-center">
            <div className="w-16 h-8 bg-red-500 rounded-sm"></div>
            <span className="ml-2">Danger Zone</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-5">
          {metrics.map((metric, index) => (
            <DashboardCard key={index} {...metric} />
          ))}
        </div>

        
      </div>
    </div>
  );
};

export default Dashboard;