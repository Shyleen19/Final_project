import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Sidebar from '../Components/Sidebar.jsx';
import DashboardCard from './DashboardCard.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import BackendConnection from '../services/backendConnection.js';

const Dashboard = () => {
  const alertAudio = useRef(new Audio('/alarm.mp3'));
  const { state } = useLocation();
  const { user_id, first_name, last_name } = state || {};

  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentVitals, setCurrentVitals] = useState(null);
  const [previousVitals, setPreviousVitals] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [abnormalMode, setAbnormalMode] = useState(false);
  const [alertActive, setAlertActive] = useState(false);
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
    systolic_bp: (140 + Math.random() * 30).toFixed(2),
    diastolic_bp: (90 + Math.random() * 20).toFixed(2),
    blood_oxygen: Math.floor(80 + Math.random() * 5),
    heart_rate: Math.floor(110 + Math.random() * 40),
    temperature: (39 + Math.random() * 2).toFixed(1),
  });

  const simulateVitals = async () => {
    const vitals = abnormalMode ? generateAbnormalVitals() : generateVitals();
    setPreviousVitals(currentVitals);
    setCurrentVitals(vitals);

    const isDanger = (
      vitals.systolic_bp > 140 ||
      vitals.diastolic_bp > 90 ||
      vitals.blood_oxygen < 90 ||
      vitals.heart_rate > 150 || vitals.heart_rate < 50 ||
      vitals.temperature > 38.5 || vitals.temperature < 35
    );
    if (isDanger) {
      if (!alertActive) {
        setAlertActive(true);
        alertAudio.current.play().catch(err => console.error("Audio error:", err));
      }
    } else {
      if (alertActive) {
        setAlertActive(false);
        alertAudio.current.pause();
        alertAudio.current.currentTime = 0;
      }
    }

    try {
      BackendConnection.setHeaders(token);
      const response = await BackendConnection.record_vitals(vitals);
      setSuccess(response.success);
    } catch (err) {
      setError(err.message || "An error has occurred.");
      setCurrentVitals(previousVitals);
    } finally {
      setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
    }
  };

  const getPercentChange = (current, previous) => {
    if (!previous || previous === 0) return { value: 'N/A', direction: null };
    const change = ((current - previous) / 100).toFixed(2);
    const direction = current > previous ? "up" : "down";
    return { change, direction };
  };

  const fetchVitals = async () => {
    try {
      BackendConnection.setHeaders(token);
      const vitals = await BackendConnection.get_vitals(user_id);
      setCurrentVitals(vitals.latest_vitals);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSimulateClick = () => {
    if (!simulating) {
      simulateVitals();
      simulateIntervalRef.current = setInterval(simulateVitals, 10000);
    } else {
      clearInterval(simulateIntervalRef.current);
    }
    setSimulating(!simulating);
  };

  const handleAbnormalModeToggle = () => {
    setAbnormalMode(!abnormalMode);
  };

  const vitalsMetrics = [
    {
      title: 'Systolic BP',
      value: currentVitals?.systolic_bp || '—',
      unit: 'mmHg',
      trend: getPercentChange(currentVitals?.systolic_bp, previousVitals?.systolic_bp),
      zone: currentVitals?.systolic_bp > 140
        ? "danger"
        : currentVitals?.systolic_bp > 120
          ? "warning"
          : "normal",
    },
    {
      title: 'Diastolic BP',
      value: currentVitals?.diastolic_bp || '—',
      unit: 'mmHg',
      trend: getPercentChange(currentVitals?.diastolic_bp, previousVitals?.diastolic_bp),
      zone: currentVitals?.diastolic_bp > 90
        ? "danger"
        : currentVitals?.diastolic_bp > 80
          ? "warning"
          : "normal",
    },
    {
      title: 'Blood Oxygen',
      value: currentVitals?.blood_oxygen || '—',
      unit: '%',
      trend: getPercentChange(currentVitals?.blood_oxygen, previousVitals?.blood_oxygen),
      zone: currentVitals?.blood_oxygen < 90
        ? "danger"
        : currentVitals?.blood_oxygen < 95
          ? "warning"
          : "normal",
    },
    {
      title: 'Heart Rate',
      value: currentVitals?.heart_rate || '—',
      unit: 'bpm',
      trend: getPercentChange(currentVitals?.heart_rate, previousVitals?.heart_rate),
      zone: currentVitals?.heart_rate > 150 || currentVitals?.heart_rate < 50
        ? "danger"
        : currentVitals?.heart_rate > 100
          ? "warning"
          : "normal",
    },
    {
      title: 'Temperature',
      value: currentVitals?.temperature || '—',
      unit: '°C',
      trend: getPercentChange(currentVitals?.temperature, previousVitals?.temperature),
      zone: currentVitals?.temperature < 35
        ? "danger"
        : currentVitals?.temperature > 38.5
          ? "danger"
          : currentVitals?.temperature > 37.2
            ? "warning"
            : "normal",
    },
  ];

  const hasDanger = vitalsMetrics.some(metric => metric.zone === 'danger');
  useEffect(() => {
    if (!token) {
      setError('Please login to access this page.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    setName(localStorage.getItem('name') || '');
    fetchVitals();
    return () => clearInterval(simulateIntervalRef.current);
  }, []);

  useEffect(() => {
    if (vitalsMetrics.some(metric => metric.zone === 'danger')) {
      if (!alertActive) {
        setAlertActive(true);
        alertAudio.current.play().catch(err => console.error("Audio error:", err));
      }
    }
  }, [currentVitals]);

  useEffect(() => {
    if (user_id) {
      fetchIntervalRef.current = setInterval(fetchVitals, 5000);
      return () => clearInterval(fetchIntervalRef.current);
    }
  }, [user_id]);

  const stopAlert = () => {
    setAlertActive(false);
    alertAudio.current.pause();
    alertAudio.current.currentTime = 0;
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-[#EDFCFF] p-10">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{user_id ? `Viewing ${first_name} ${last_name}'s Vitals` : "Dashboard"}</h1>
          <div className="flex items-center mr-12">
            <span className="text-xl mr-12">05:10:10</span>
            <FontAwesomeIcon icon={faBell} className="text-xl" />
          </div>
        </header>
        <p className="text-xl mt-2">Welcome back {name}</p>

        {error && <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mt-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 border border-green-400 px-4 py-3 rounded mt-4">{success}</div>}
        {hasDanger && (
          <div className="animate-pulse bg-red-700 text-white text-xl font-bold px-6 py-4 rounded mt-6 shadow-lg border-4 border-white flex items-center justify-center">
            🚨 CRITICAL ALERT: Abnormal Vitals Detected! 🚨
          </div>
        )}

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

        <div className="flex space-x-4 mt-6">

         {!user_id && 
         <><button
            onClick={handleSimulateClick}
            className={`px-4 py-2 rounded-md font-bold ${simulating ? 'bg-red-600' : 'bg-green-600'} text-white`}
          >
            {simulating ? '🛑 Stop Simulation' : '▶️ Start Smartwatch Simulation'}
          </button>

          <button
            onClick={handleAbnormalModeToggle}
            className={`px-4 py-2 rounded-md font-bold ${abnormalMode ? 'bg-yellow-600' : 'bg-gray-600'} text-white`}
          >
            {abnormalMode ? '⚠️ Abnormal Mode On' : '🟢 Normal Mode'}
          </button> </> }

          {alertActive && (
            <button onClick={stopAlert} className="bg-red-600 text-white px-4 py-2 rounded-md">
              🛑 Stop Alert
            </button>
          )}
        </div>

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
