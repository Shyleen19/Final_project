// src/components/Sidebar.js
import React from 'react';

const Sidebar = () => {
  const role = (localStorage.getItem('role') || '').toLowerCase();

  return (
    <div className="h-screen bg-[#00D9FF] p-8 flex flex-col sticky top-0 min-w-[250px]">
      <div className="flex items-center mt-5">
        <h2 className="text-white text-2xl font-bold">DialiCare</h2>
      </div>
      <nav className="flex flex-col flex-grow mt-7">
        <ul className="flex-grow">
          <a href={role === 'admin' ? '/main-dashboard' : role === 'caregiver' ? '/caregiver-dashboard' : '/patient-dashboard'}>
            <li className="text-white my-6 cursor-pointer hover:text-black">Dashboard</li>
          </a>

          {role === 'patient' && (
            <>
              <a href="/patient-dashboard"><li className="text-white my-6 cursor-pointer hover:text-black">My-Vitals</li></a>
              <a href="/patient-caregivers"><li className="text-white my-6 cursor-pointer hover:text-black">My-Caregivers</li></a>
              <a href="/patient-report"><li className="text-white my-6 cursor-pointer hover:text-black">Reports</li></a>
            </>
          )}

          {role === 'caregiver' && (
            <>
              <a href="/caregiver/my-patients"><li className="text-white my-6 cursor-pointer hover:text-black">My-Patients</li></a>
              <a href="/patient-report"><li className="text-white my-6 cursor-pointer hover:text-black">Reports</li></a>
            </>
          )}
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