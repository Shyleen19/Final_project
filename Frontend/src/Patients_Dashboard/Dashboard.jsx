import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Sidebar from '../Components/Sidebar.jsx';
import DashboardCard from './DashboardCard.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import BackendConnection from '../services/backendConnection.js';

const Dashboard = () => {
  const alertAudio = useRef(new Audio('/alarm.mp3'));
  const { state } = useLocation();
  const { user_id, first_name, last_name } = state || {};
  const isReadOnly = !!user_id || (localStorage.getItem('role') || '').toLowerCase() === 'caregiver';

  const [name, setName] = useState('');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState({ id: user_id || 0, first_name: first_name || '', last_name: last_name || '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentVitals, setCurrentVitals] = useState(null);
  const [previousVitals, setPreviousVitals] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [abnormalMode, setAbnormalMode] = useState(false);
  const [alertActive, setAlertActive] = useState(false);
  const [silencedAlertId, setSilencedAlertId] = useState(null);
  const simulateIntervalRef = useRef(null);
  const fetchIntervalRef = useRef(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [vitalsHistory, setVitalsHistory] = useState([]);
  const [showLogForm, setShowLogForm] = useState(false);
  const [newVitals, setNewVitals] = useState({
    systolic_bp: '',
    diastolic_bp: '',
    body_weight: '',
    heart_rate: '',
    edema: 'None',
    shortness_of_breath: 'None'
  });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const generateVitals = () => ({
    systolic_bp: (110 + Math.random() * 20).toFixed(2),
    diastolic_bp: (70 + Math.random() * 15).toFixed(2),
    body_weight: (65 + Math.random() * 5).toFixed(2),
    heart_rate: Math.floor(60 + Math.random() * 40),
    edema: "None",
    shortness_of_breath: "None",
    recorded_at: new Date().toISOString(), // Add local timestamp for tracking
  });

  const generateAbnormalVitals = () => ({
    systolic_bp: (150 + Math.random() * 30).toFixed(2),
    diastolic_bp: (100 + Math.random() * 20).toFixed(2),
    body_weight: (75 + Math.random() * 10).toFixed(2),
    heart_rate: Math.floor(110 + Math.random() * 40),
    edema: "Moderate",
    shortness_of_breath: "Mild",
    recorded_at: new Date().toISOString(), // Add local timestamp for tracking
  });

  const simulateVitals = async () => {
    const vitals = abnormalMode ? generateAbnormalVitals() : generateVitals();
    if (!currentVitals) {
      // First run: generate a baseline as well
      setPreviousVitals(generateVitals());
    } else {
      setPreviousVitals(currentVitals);
    }
    setCurrentVitals(vitals);

    // Removed direct audio control from here to centralize in useEffect

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
    const severityMap = { 'None': 0, 'Mild': 1, 'Moderate': 2, 'Severe': 3 };

    // Helper to get numeric value, handling strings from the map or parsing numbers
    const getVal = (val) => {
      if (val === null || val === undefined || val === '') return NaN;
      if (typeof val === 'string' && severityMap[val] !== undefined) return severityMap[val];
      const parsed = parseFloat(val);
      return isNaN(parsed) ? (typeof val === 'string' ? severityMap[val] || 0 : 0) : parsed;
    };

    const cVal = getVal(current);
    const pVal = getVal(previous);

    // If we can't calculate a trend, show 0% stable to keep the UI consistent
    if (isNaN(cVal) || isNaN(pVal)) return { change: '0', direction: 'stable' };

    if (cVal === pVal) return { change: '0', direction: 'stable' };
    if (pVal === 0) return { change: '100+', direction: 'up' };

    const change = (((cVal - pVal) / pVal) * 100).toFixed(1);
    const direction = cVal > pVal ? "up" : "down";
    return { change: Math.abs(parseFloat(change)).toFixed(1), direction };
  };

  const fetchVitals = async (id = selectedPatient.id) => {
    try {
      BackendConnection.setHeaders(token);
      const data = await BackendConnection.get_vitals(id);
      const history = data.vitals_history || [];
      setVitalsHistory(history);

      if (history.length > 0) {
        setCurrentVitals(history[0]);
        if (history.length > 1) {
          setPreviousVitals(history[1]);
        } else {
          setPreviousVitals(history[0]);
        }
      } else {
        setCurrentVitals(null);
        setPreviousVitals(null);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchPatients = async () => {
    try {
      BackendConnection.setHeaders(token);
      const data = await BackendConnection.get_patients();
      setPatients(data);
      if (data.length > 0 && !user_id) {
        setSelectedPatient({
          id: data[0].user_id,
          first_name: data[0].first_name,
          last_name: data[0].last_name
        });
      }
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
      title: 'Body Weight',
      value: currentVitals?.body_weight || '—',
      unit: 'kg',
      trend: getPercentChange(currentVitals?.body_weight, previousVitals?.body_weight),
      zone: currentVitals?.body_weight > 90
        ? "danger"
        : currentVitals?.body_weight > 80
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
      title: 'Edema',
      value: currentVitals?.edema || '—',
      unit: '',
      trend: getPercentChange(currentVitals?.edema, previousVitals?.edema),
      zone: currentVitals?.edema === "Severe"
        ? "danger"
        : ["Mild", "Moderate"].includes(currentVitals?.edema)
          ? "warning"
          : "normal",
    },
    {
      title: 'Shortness of Breath',
      value: currentVitals?.shortness_of_breath || '—',
      unit: '',
      trend: getPercentChange(currentVitals?.shortness_of_breath, previousVitals?.shortness_of_breath),
      zone: currentVitals?.shortness_of_breath === "Severe"
        ? "danger"
        : ["Mild", "Moderate"].includes(currentVitals?.shortness_of_breath)
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
    const role = (localStorage.getItem('role') || '').toLowerCase();
    
    if (role === 'caregiver' && !user_id) {
      fetchPatients();
    } else {
      fetchVitals();
    }
    
    return () => clearInterval(simulateIntervalRef.current);
  }, []);

  useEffect(() => {
    if (selectedPatient.id !== 0 || !user_id) {
        fetchVitals(selectedPatient.id);
    }
  }, [selectedPatient.id]);

  useEffect(() => {
    const isCurrentlyDangerous = vitalsMetrics.some(metric => metric.zone === 'danger');
    const vitalId = currentVitals?.recorded_at || currentVitals?.id;

    if (isCurrentlyDangerous) {
      // Only play if not already active and this specific vital haven't been silenced
      if (!alertActive && vitalId !== silencedAlertId) {
        setAlertActive(true);
        alertAudio.current.play().catch(err => console.error("Audio error:", err));
      }
    } else {
      // If danger is gone, stop the alert and reset silencing for next time
      if (alertActive) {
        setAlertActive(false);
        alertAudio.current.pause();
        alertAudio.current.currentTime = 0;
      }
      if (silencedAlertId) {
        setSilencedAlertId(null);
      }
    }
  }, [currentVitals, silencedAlertId]);

  useEffect(() => {
    fetchIntervalRef.current = setInterval(() => fetchVitals(selectedPatient.id), 5000);
    return () => clearInterval(fetchIntervalRef.current);
  }, [selectedPatient.id]);

  const stopAlert = () => {
    setAlertActive(false);
    // Mark current vitals as silenced so we don't re-trigger for the same record
    setSilencedAlertId(currentVitals?.recorded_at || currentVitals?.id);
    alertAudio.current.pause();
    alertAudio.current.currentTime = 0;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 bg-[#EDFCFF] p-10 overflow-y-auto">
        <header className="flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            {isReadOnly && patients.length > 1 && (
              <select 
                className="mt-2 p-2 rounded-md border border-[#00D9FF] bg-white text-sm"
                value={selectedPatient.id}
                onChange={(e) => {
                  const p = patients.find(pat => pat.user_id === parseInt(e.target.value));
                  if (p) {
                    setSelectedPatient({
                      id: p.user_id,
                      first_name: p.first_name,
                      last_name: p.last_name
                    });
                  }
                }}
              >
                {patients.map(p => (
                  <option key={p.user_id} value={p.user_id}>
                    Switch to {p.first_name} {p.last_name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="flex items-center mr-12">
            <span className="text-xl mr-12">05:10:10</span>
            <FontAwesomeIcon icon={faBell} className="text-xl" />
          </div>
        </header>
        <p className="text-xl mt-2">
          {isReadOnly ? (
            <span><strong>Greetings!</strong> Viewing {selectedPatient.first_name} {selectedPatient.last_name}'s health</span>
          ) : `Welcome back ${name}`}
        </p>

        {/* Tab Navigation */}
        <div className="flex space-x-8 mt-8 border-b-2 border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 px-4 text-xl font-bold transition ${activeTab === 'overview' ? 'border-b-4 border-[#00D9FF] text-[#00D9FF]' : 'text-gray-500'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`pb-2 px-4 text-xl font-bold transition ${activeTab === 'progress' ? 'border-b-4 border-[#00D9FF] text-[#00D9FF]' : 'text-gray-500'}`}
          >
            Progress Tracker
          </button>
        </div>

        {error && <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mt-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 border border-green-400 px-4 py-3 rounded mt-4">{success}</div>}
        {hasDanger && (
          <div className="animate-pulse bg-red-700 text-white text-xl font-bold px-6 py-4 rounded mt-6 shadow-lg border-4 border-white flex items-center justify-center">
            🚨 CRITICAL ALERT: Abnormal Vitals Detected! 🚨
          </div>
        )}

        {activeTab === 'overview' ? (
          <>
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

            {!isReadOnly && (
              <div className="flex space-x-4 mt-6">
                {alertActive && (
                  <button onClick={stopAlert} className="bg-red-600 text-white px-4 py-2 rounded-md">
                    🛑 Stop Alert
                  </button>
                )}
                <button
                  onClick={() => setShowLogForm(!showLogForm)}
                  className="bg-[#00D9FF] text-white px-6 py-2 rounded-md font-bold hover:bg-blue-600"
                >
                  {showLogForm ? '✖ Cancel' : '📝 Log Today\'s Vitals'}
                </button>
              </div>
            )}

            {showLogForm && (
              <div className="mt-8 bg-white p-6 rounded-lg shadow-md max-w-2xl border-2 border-[#00D9FF]">
                <h2 className="text-2xl font-bold mb-4 text-[#00D9FF]">Enter Health Indicators</h2>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    BackendConnection.setHeaders(token);
                    const response = await BackendConnection.record_vitals(newVitals);
                    setSuccess(response.success);
                    setNewVitals({
                      systolic_bp: '',
                      diastolic_bp: '',
                      body_weight: '',
                      heart_rate: '',
                      edema: 'None',
                      shortness_of_breath: 'None'
                    });
                    setShowLogForm(false);
                    fetchVitals();
                  } catch (err) {
                    setError(err.message || "An error has occurred.");
                  }
                }} className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium">Systolic BP (mmHg)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="w-full border-b-2 border-gray-300 py-2 focus:border-[#00D9FF] outline-none"
                      value={newVitals.systolic_bp}
                      onChange={(e) => setNewVitals({ ...newVitals, systolic_bp: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium">Diastolic BP (mmHg)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="w-full border-b-2 border-gray-300 py-2 focus:border-[#00D9FF] outline-none"
                      value={newVitals.diastolic_bp}
                      onChange={(e) => setNewVitals({ ...newVitals, diastolic_bp: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium">Body Weight (kg)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="w-full border-b-2 border-gray-300 py-2 focus:border-[#00D9FF] outline-none"
                      value={newVitals.body_weight}
                      onChange={(e) => setNewVitals({ ...newVitals, body_weight: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium">Heart Rate (bpm)</label>
                    <input
                      type="number"
                      required
                      className="w-full border-b-2 border-gray-300 py-2 focus:border-[#00D9FF] outline-none"
                      value={newVitals.heart_rate}
                      onChange={(e) => setNewVitals({ ...newVitals, heart_rate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium">Edema</label>
                    <select
                      className="w-full border-b-2 border-gray-300 py-2 focus:border-[#00D9FF] outline-none bg-white"
                      value={newVitals.edema}
                      onChange={(e) => setNewVitals({ ...newVitals, edema: e.target.value })}
                    >
                      <option value="None">None</option>
                      <option value="Mild">Mild (+1)</option>
                      <option value="Moderate">Moderate (+2)</option>
                      <option value="Severe">Severe (+3/+4)</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-gray-700 font-medium">Shortness of Breath</label>
                    <select
                      className="w-full border-b-2 border-gray-300 py-2 focus:border-[#00D9FF] outline-none bg-white"
                      value={newVitals.shortness_of_breath}
                      onChange={(e) => setNewVitals({ ...newVitals, shortness_of_breath: e.target.value })}
                    >
                      <option value="None">None</option>
                      <option value="Mild">Mild (during exertion)</option>
                      <option value="Moderate">Moderate (at rest)</option>
                      <option value="Severe">Severe (emergency)</option>
                    </select>
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <button type="submit" className="bg-[#00D9FF] text-white px-10 py-3 rounded-md font-bold hover:shadow-lg transition">
                      Save Records
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 mt-5">
              {vitalsMetrics.map((metric, index) => (
                <DashboardCard key={index} {...metric} />
              ))}
            </div>
          </>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Row 1: Weight and BP */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h2 className="text-xl font-bold mb-6 text-gray-700">Weight Trend (kg)</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[...vitalsHistory].sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at)).slice(-7)} margin={{ top: 20, right: 40, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="recorded_at" tickFormatter={(str) => new Date(str).toLocaleDateString()} padding={{ left: 30, right: 30 }} />
                    <YAxis domain={[65, 105]} padding={{ top: 20, bottom: 20 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="body_weight" stroke="#00D9FF" strokeWidth={3} name="Weight" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h2 className="text-xl font-bold mb-6 text-gray-700">Blood Pressure (mmHg)</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[...vitalsHistory].sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at)).slice(-7)} margin={{ top: 20, right: 40, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="recorded_at" tickFormatter={(str) => new Date(str).toLocaleDateString()} padding={{ left: 30, right: 30 }} />
                    <YAxis domain={[45, 120]} padding={{ top: 20, bottom: 20 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="systolic_bp" stroke="#FF5252" strokeWidth={2} name="Systolic" />
                    <Line type="monotone" dataKey="diastolic_bp" stroke="#4CAF50" strokeWidth={2} name="Diastolic" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Row 2: Heart Rate and Edema */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h2 className="text-xl font-bold mb-6 text-gray-700">Heart Rate (bpm)</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[...vitalsHistory].sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at)).slice(-7)} margin={{ top: 20, right: 40, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="recorded_at" tickFormatter={(str) => new Date(str).toLocaleDateString()} padding={{ left: 30, right: 30 }} />
                    <YAxis domain={['auto', 'auto']} padding={{ top: 20, bottom: 20 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="heart_rate" stroke="#9C27B0" strokeWidth={3} name="Heart Rate" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h2 className="text-xl font-bold mb-6 text-gray-700">Edema Severity Trend</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[...vitalsHistory].sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at)).slice(-7).map(v => ({ ...v, edema_val: { 'None': 0, 'Mild': 1, 'Moderate': 2, 'Severe': 3 }[v.edema] }))} margin={{ top: 20, right: 40, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="recorded_at" tickFormatter={(str) => new Date(str).toLocaleDateString()} padding={{ left: 30, right: 30 }} />
                    <YAxis
                      domain={[0, 4]}
                      ticks={[0, 1, 2, 3]}
                      tickFormatter={(val) => ({ 0: 'None', 1: 'Mild', 2: 'Mod', 3: 'Sev' }[val])}
                    />
                    <Tooltip formatter={(value) => ({ 0: 'None', 1: 'Mild', 2: 'Moderate', 3: 'Severe' }[value])} />
                    <Line type="monotone" dataKey="edema_val" stroke="#FF9800" strokeWidth={3} name="Edema" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Row 3: S.O.B (Full width if centered) */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 lg:col-span-2">
              <h2 className="text-xl font-bold mb-6 text-gray-700">Shortness of Breath Trend</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[...vitalsHistory].sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at)).slice(-7).map(v => ({ ...v, sob_val: { 'None': 0, 'Mild': 1, 'Moderate': 2, 'Severe': 3 }[v.shortness_of_breath] }))} margin={{ top: 20, right: 40, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="recorded_at" tickFormatter={(str) => new Date(str).toLocaleDateString()} padding={{ left: 30, right: 30 }} />
                    <YAxis
                      domain={[0, 4]}
                      ticks={[0, 1, 2, 3]}
                      tickFormatter={(val) => ({ 0: 'None', 1: 'Mild', 2: 'Mod', 3: 'Sev' }[val])}
                    />
                    <Tooltip formatter={(value) => ({ 0: 'None', 1: 'Mild', 2: 'Moderate', 3: 'Severe' }[value])} />
                    <Line type="monotone" dataKey="sob_val" stroke="#E91E63" strokeWidth={3} name="S.O.B" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
