// src/Main_Dashboard/M_Dashboard.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar.jsx';
import M_DashboardCard from './M_DashboardCard.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';


const M_Dashboard = () => {
  const { state } = useLocation();
  const { user_id, first_name, last_name } = state || {};


  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to access this page.')

      setTimeout(() => {
        navigate('/login')
      }, 2000)
      return;
    } else {
      const storedName = localStorage.getItem('name');
      if (storedName) setName(storedName);
    }
  }, [navigate]);

  // Dummy data — replace with real data later
  const danger = 10;
  const warning = 30;
  const normal = 80;
  const totalCaregivers = 45;
  const totalPatients = 120;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-[#EDFCFF] p-10">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            {user_id ? `Viewing ${first_name} ${last_name}'s Vitals` : "Dashboard"}
          </h1>
          <div className="flex items-center mr-12">
            <span className="text-xl mr-12">{new Date().toLocaleTimeString()}</span>
            <FontAwesomeIcon icon={faBell} className="text-xl" />
          </div>
        </header>

        <p className="text-xl mt-2">Welcome back {name}</p>
        
        {error && <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mt-4">{error}</div>}

        {/* Color Code Legend */}
        {/* Color Code Legend */}
        <div className="flex space-x-24 mt-5 ">
          <div className="flex items-center">
            <div className="w-16 h-8 bg-green-500 rounded-sm "></div>
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

        {/* Dashboard Stats */}
        <M_DashboardCard
          totalPatients={totalPatients}
          totalCaregivers={totalCaregivers}
          normal={normal}
          warning={warning}
          danger={danger}
        />
      </div>
    </div>
  );
};

export default M_Dashboard;
