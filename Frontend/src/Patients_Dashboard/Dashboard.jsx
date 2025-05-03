// src/components/Dashboard.js
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Sidebar from '../Components/Sidebar.jsx';
import DashboardCard from './DashboardCard.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import BackendConnection from '../services/backendConnection.js'


const Dashboard = () => {
  const { state } = useLocation();
  const { user_id, first_name, last_name } = state || {};

  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentVitals, setCurrentVitals] = useState(null)
  const [previousVitals, setPreviousVitals] = useState(null)
  const [simulating, setSimulating] = useState(false);
  const [abnormalMode, setAbnormalMode] = useState(false);
  const simulateIntervalRef = useRef(null);
  const fetchIntervalRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const generateVitals = () => ({
    systolic_bp: (100 + Math.random() * 30).toFixed(2),
    diastolic_bp: (60 + Math.random() * 20).toFixed(2),
    blood_oxygen: Math.floor(94 + Math.random() * 5),
    heart_rate: Math.floor(60 + Math.random() * 40),
    temperature: (36 + Math.random() * 1.5).toFixed(1),
  });

  const generateAbnormalVitals = () => ({
    systolic_bp: (140 + Math.random() * 30).toFixed(2),        // High
    diastolic_bp: (90 + Math.random() * 20).toFixed(2),        // High
    blood_oxygen: Math.floor(80 + Math.random() * 5),          // Low
    heart_rate: Math.floor(110 + Math.random() * 40),          // High
    temperature: (39 + Math.random() * 2).toFixed(1),          // High fever
  });

  const simulateVitals = async () => {
    const vitals = abnormalMode ? generateAbnormalVitals() : generateVitals();

    // update the UI and record the vitals to the backend.  
    setPreviousVitals(currentVitals)
    setCurrentVitals(vitals)
    console.log("Current vitals: ", vitals)

    try {
      BackendConnection.setHeaders(token);
      const response = await BackendConnection.record_vitals(vitals);
      console.log("I am on fire.")

      setSuccess(response.success);
    } catch (err) {
      setError(err.message || "An error has occurred.");
      // Roll back if the changes fail.
      setCurrentVitals(previousVitals)
    } finally {
      setTimeout(() => {
        setError('')
        setSuccess('')
      }, 5000);
    }
  };

  const getPercentChange = (current, previous) => {

    if (!previous || previous === 0) return { value: 'N/A', direction: null };

    const change = ((current - previous) / 100).toFixed(2)
    const direction = current > previous ? "up" : "down";

    return { change, direction }
  }


  const fetchVitals = async () => {
    try {
      BackendConnection.setHeaders(token)
      const vitals = await BackendConnection.get_vitals(user_id)

      setCurrentVitals(vitals.latest_vitals)
    } catch (error) {
      setError(error)
    }
  }

  const handleSimulateClick = () => {
    if (!simulating) {
      simulateVitals();
      simulateIntervalRef.current = setInterval(simulateVitals, 10000);
    } else {
      clearInterval(simulateIntervalRef.current);
    }
    setSimulating(!simulating);
  };


  const vitalsMetrics = [
    {
      title: 'Systolic BP',
      value: currentVitals?.systolic_bp || '—',
      unit: 'mmHg',
      trend: getPercentChange(currentVitals?.systolic_bp, previousVitals?.systolic_bp),
    },
    {
      title: 'Diastolic BP',
      value: currentVitals?.diastolic_bp || '—',
      unit: 'mmHg',
      trend: getPercentChange(currentVitals?.diastolic_bp, previousVitals?.diastolic_bp),
    },
    {
      title: 'Blood Oxygen',
      value: currentVitals?.blood_oxygen || '—',
      unit: '%',
      trend: getPercentChange(currentVitals?.blood_oxygen, previousVitals?.blood_oxygen),
    },
    {
      title: 'Heart Rate',
      value: currentVitals?.heart_rate || '—',
      unit: 'bpm',
      trend: getPercentChange(currentVitals?.heart_rate, previousVitals?.heart_rate),
    },
    {
      title: 'Temperature',
      value: currentVitals?.temperature || '—',
      unit: '°C',
      trend: getPercentChange(currentVitals?.temperature, previousVitals?.temperature),
    },
  ];

  useEffect(() => {
    if (!token) navigate('/login');

    setName(localStorage.getItem('name') || '');
    fetchVitals()
    return () => clearInterval(simulateIntervalRef.current)
    return () => clearInterval(fetchIntervalRef.current)

  }, []);

  // Always fetch the vitals once per five seconds if the user_id is set.
  useEffect(() => {
    if (user_id) {
      fetchIntervalRef.current = setInterval(fetchVitals, 5000)
      return () => clearInterval(fetchIntervalRef.current)
    }
  }, [user_id])

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-[#EDFCFF] p-10">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            {user_id ? `Viewing ${first_name} ${last_name}'s Vitals` : "Dashboard"}
          </h1>
          <div className="flex items-center mr-12">
            <span className="text-xl mr-12">05:10:10</span>
            <FontAwesomeIcon icon={faBell} className="text-xl" />
          </div>
        </header>

        <p className="text-xl mt-2">Welcome back {name}</p>

        {error && <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mt-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 border border-green-400 px-4 py-3 rounded mt-4">{success}</div>}

        <div className="flex space-x-24 mt-5">
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

        {user_id ? (
          <></>
        ) : (
          <>          <button
            onClick={handleSimulateClick}
            className={`px-4 py-2 rounded-md font-bold ${simulating ? 'bg-red-600' : 'bg-green-600'} text-white mt-6`}
          >
            {simulating ? '🛑 Stop Simulation' : '▶️ Start Smartwatch Simulation'}
          </button>

            <button
              onClick={() => setAbnormalMode(!abnormalMode)}
              className={`px-4 py-2 rounded-md font-bold ${abnormalMode ? 'bg-yellow-600' : 'bg-gray-600'} text-white mt-6 ml-4`}
            >
              {abnormalMode ? '⚠️ Abnormal Mode On' : '🟢 Normal Mode'}
            </button>
          </>

        )}

        <div className="grid grid-cols-3 gap-4 mt-5">
          {vitalsMetrics.map((metric, index) => (
            <DashboardCard key={index} {...metric} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
