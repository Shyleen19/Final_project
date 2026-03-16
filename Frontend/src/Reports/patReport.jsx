import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Sidebar from "../Components/Sidebar.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faDownload } from "@fortawesome/free-solid-svg-icons";
import BackendConnection from "../services/backendConnection.js";

export default function VitalsGraph() {
  const [vitalsHistory, setVitalsHistory] = useState([]);
  const [name, setName] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState({ id: 0, first_name: '', last_name: '' });
  const [error, setError] = useState("");
  const role = (localStorage.getItem('role') || '').toLowerCase();
  const isReadOnly = role === 'caregiver';

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");
      BackendConnection.setHeaders(token);
      const data = await BackendConnection.get_patients();
      setPatients(data);
      if (data.length > 0) {
        setSelectedPatient({
          id: data[0].user_id,
          first_name: data[0].first_name,
          last_name: data[0].last_name
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async (id = selectedPatient.id) => {
    try {
      const token = localStorage.getItem("token");
      BackendConnection.setHeaders(token);
      const data = await BackendConnection.get_vitals(id);
      setVitalsHistory(data.vitals_history || []);
    } catch (err) {
      setError("Failed to fetch history");
      console.error(err);
    }
  };

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) setName(storedName);

    if (isReadOnly) {
      fetchPatients();
    } else {
      fetchHistory(0);
    }
  }, []);

  useEffect(() => {
    if (isReadOnly && selectedPatient.id !== 0) {
      fetchHistory(selectedPatient.id);
    }
  }, [selectedPatient.id]);

  const handleDownload = async (period) => {
    try {
      const blob = await BackendConnection.download_vitals(period, selectedPatient.id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `DialiCare_Report_${period}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
      setError("Failed to download report");
    }
  };

  // Format data for chart (explicitly sort by date for correct line drawing)
  const chartData = [...vitalsHistory].sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at));

  // Calculate Weekly Statistics (last 7 entries)
  const getWeeklyStats = () => {
    const last7Entries = vitalsHistory.slice(0, 7);
    if (last7Entries.length === 0) return null;

    const sum = last7Entries.reduce((acc, curr) => ({
      systolic: acc.systolic + parseFloat(curr.systolic_bp || 0),
      diastolic: acc.diastolic + parseFloat(curr.diastolic_bp || 0),
      weight: acc.weight + parseFloat(curr.body_weight || 0),
      heartRate: acc.heartRate + parseFloat(curr.heart_rate || 0),
    }), { systolic: 0, diastolic: 0, weight: 0, heartRate: 0 });

    const count = last7Entries.length;
    return {
      avgSystolic: (sum.systolic / count).toFixed(1),
      avgDiastolic: (sum.diastolic / count).toFixed(1),
      avgWeight: (sum.weight / count).toFixed(1),
      avgHeartRate: Math.round(sum.heartRate / count),
      count
    };
  };

  const weeklyStats = getWeeklyStats();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 bg-[#EDFCFF] p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Health Reports</h1>
            <p className="text-xl mt-2">
              {isReadOnly ? (
                <span><strong>Greetings!</strong> Viewing {selectedPatient.first_name} {selectedPatient.last_name}'s health</span>
              ) : `Welcome back ${name}`}
            </p>
            {isReadOnly && patients.length > 1 && (
              <select 
                className="mt-4 p-2 rounded-md border border-[#00D9FF] bg-white text-sm"
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
                    View Report for {p.first_name} {p.last_name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-4 mr-6">
              <button
                onClick={() => handleDownload('weekly')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
              >
                <FontAwesomeIcon icon={faDownload} />
                Download Weekly Report
              </button>
              <button
                onClick={() => handleDownload('annual')}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
              >
                <FontAwesomeIcon icon={faDownload} />
                Download Annual Report
              </button>
            </div>
            <span className="text-xl flex">{new Date().toLocaleTimeString()}</span>
            <FontAwesomeIcon icon={faBell} className="text-xl text-blue-500" />
          </div>
        </header>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}

        {/* Weekly Insights Section */}
        {weeklyStats && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Weekly Health Insights (Last {weeklyStats.count} records)</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-[#FF5252]">
                <p className="text-gray-500 font-medium">Avg. Blood Pressure</p>
                <h3 className="text-3xl font-extrabold mt-2 text-[#FF5252]">
                  {weeklyStats.avgSystolic}/{weeklyStats.avgDiastolic}
                </h3>
                <p className="text-sm text-gray-400 mt-1">mmHg</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-[#9C27B0]">
                <p className="text-gray-500 font-medium">Avg. Heart Rate</p>
                <h3 className="text-3xl font-extrabold mt-2 text-[#9C27B0]">
                  {weeklyStats.avgHeartRate}
                </h3>
                <p className="text-sm text-gray-400 mt-1">bpm</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-[#00D9FF]">
                <p className="text-gray-500 font-medium">Avg. Body Weight</p>
                <h3 className="text-3xl font-extrabold mt-2 text-[#00D9FF]">
                  {weeklyStats.avgWeight}
                </h3>
                <p className="text-sm text-gray-400 mt-1">kg</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-[#4CAF50]">
                <p className="text-gray-500 font-medium">Health Status</p>
                <h3 className="text-2xl font-extrabold mt-2 text-[#4CAF50]">
                  {parseFloat(weeklyStats.avgSystolic) > 140 || parseFloat(weeklyStats.avgDiastolic) > 90 ? "Attention Required" : "Stable"}
                </h3>
                <p className="text-sm text-gray-400 mt-1">Based on averages</p>
              </div>
            </div>
          </div>
        )}

        {/* BP and Heart Rate Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Blood Pressure & Heart Rate Trends</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 40, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="recorded_at"
                  tickFormatter={(str) => new Date(str).toLocaleDateString()}
                  padding={{ left: 30, right: 30 }}
                />
                <YAxis domain={[45, 120]} padding={{ top: 20, bottom: 20 }} />
                <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
                <Legend />
                <Line type="monotone" dataKey="systolic_bp" stroke="#FF5252" strokeWidth={2} name="Systolic BP" />
                <Line type="monotone" dataKey="diastolic_bp" stroke="#4CAF50" strokeWidth={2} name="Diastolic BP" />
                <Line type="monotone" dataKey="heart_rate" stroke="#9C27B0" strokeWidth={2} name="Heart Rate" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weight Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Body Weight Trend (kg)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 40, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="recorded_at"
                  tickFormatter={(str) => new Date(str).toLocaleDateString()}
                  padding={{ left: 30, right: 30 }}
                />
                <YAxis domain={[65, 105]} padding={{ top: 20, bottom: 20 }} />
                <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
                <Legend />
                <Line type="monotone" dataKey="body_weight" stroke="#00D9FF" strokeWidth={3} name="Weight" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Logs Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <h2 className="text-xl font-bold p-6 bg-gray-50 border-b text-gray-700">Detailed Vital Logs</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6">Date & Time</th>
                  <th className="py-3 px-6">BP (mmHg)</th>
                  <th className="py-3 px-6">Weight (kg)</th>
                  <th className="py-3 px-6">Heart Rate</th>
                  <th className="py-3 px-6">Edema</th>
                  <th className="py-3 px-6">Shortness of Breath</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {vitalsHistory.map((vital) => (
                  <tr key={vital.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 whitespace-nowrap">
                      {new Date(vital.recorded_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-6">
                      {vital.systolic_bp}/{vital.diastolic_bp}
                    </td>
                    <td className="py-3 px-6">{vital.body_weight}</td>
                    <td className="py-3 px-6">{vital.heart_rate} bpm</td>
                    <td className="py-3 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs ${vital.edema === 'Severe' ? 'bg-red-200 text-red-800' :
                        vital.edema === 'Moderate' ? 'bg-orange-200 text-orange-800' :
                          vital.edema === 'Mild' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
                        }`}>
                        {vital.edema}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs ${vital.shortness_of_breath === 'Severe' ? 'bg-red-200 text-red-800' :
                        vital.shortness_of_breath === 'Moderate' ? 'bg-orange-200 text-orange-800' :
                          vital.shortness_of_breath === 'Mild' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
                        }`}>
                        {vital.shortness_of_breath}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
