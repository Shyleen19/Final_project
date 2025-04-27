// src/components/Sidebar.js
import React from 'react';

const Sidebar = () => {
  return (
    <div style={{ backgroundColor: '#00D9FF' }} className="h-screen p-8 flex flex-col">
      <div className="flex items-center mt-5">
        <h2 className="text-white text-2xl font-bold">VitaLink</h2>
      </div>
      <nav className="flex flex-col flex-grow mt-7">
        <ul className="flex-grow">
          <a href="/patient-dashboard"><li className="text-white my-6 cursor-pointer hover:text-black">Dashboard</li></a>
          <a href="/caregivers"><li className="text-white my-6 cursor-pointer hover:text-black">Care Givers</li></a>
          <li className="text-white my-6 cursor-pointer hover:text-black">Reports</li>
          <li className="text-white my-6 cursor-pointer hover:text-black">Settings</li>
        </ul>
        <div>
          <ul>
            <li className="text-white my-6 cursor-pointer hover:text-black">Help</li>
            <a href="/logout"><li className="text-white my-6 cursor-pointer hover:text-black">Logout</li></a>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;