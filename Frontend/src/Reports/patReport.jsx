import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Sidebar from "../Components/Sidebar.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button.jsx"; // ✅ Use the reusable Button component

const data = [
  { time: "12 AM", heartRate: 75, temperature: 37, respiratoryRate: 18, oxygenSaturation: 100 },
  { time: "6 AM", heartRate: 76, temperature: 37, respiratoryRate: 18, oxygenSaturation: 100 },
  { time: "12 PM", heartRate: 79, temperature: 37, respiratoryRate: 18, oxygenSaturation: 100 },
  { time: "6 PM", heartRate: 77, temperature: 37, respiratoryRate: 17, oxygenSaturation: 100 },
];

export default function VitalsGraph() {
  const name = "Jay"; // You can replace this with dynamic data

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 bg-[#EDFCFF] p-10 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-xl mt-2">Welcome back {name}</p>
          </div>
          <div className="flex items-center">
            <span className="text-xl mr-12 flex  ">05:10:10</span>
            <FontAwesomeIcon icon={faBell} className="text-xl text-blue-500" />
          </div>
        </header>

        {/* Time Range Buttons */}
        <div className="flex gap-8 mb-6">
          {["Daily", "Weekly", "Monthly", "Yearly", "All"].map((label) => (
            <Button key={label} className="bg-cyan-400 hover:bg-cyan-500 text-white">
              {label}
            </Button>
          ))}
        </div>

        {/* Download Button */}
        <div className="mb-4 flex justify-end">
          <Button className="bg-cyan-400 text-white">Download Record</Button>
        </div>

        {/* Vitals Chart */}
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-lg font-semibold mb-4">Vitals Graph - DAILY</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="heartRate" stroke="red" name="Heart Rate" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="temperature" stroke="orange" name="Temperature" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="respiratoryRate" stroke="green" name="Respiratory Rate" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="oxygenSaturation" stroke="blue" name="Oxygen Saturation" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
