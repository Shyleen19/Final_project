
import { useNavigate } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import './index.css';
import Dashboard from './Patients_Dashboard/Dashboard.jsx';
import M_Dashboard from './Main_Dashboard/M_Dashboard.jsx';
import LandingPage from './LandingPage/LandingPage.jsx';
import Login from './Authentication/login.jsx';
import VitalsGraph from './Reports/patReport.jsx'

import { useEffect } from 'react';
import Register from './Authentication/register.jsx';
import ActivateAccount from './Authentication/activateAccount.jsx';
import PatientCaregivers from './Patients_Caregivers/Caregiver.jsx';
import AccountConfirmed from './Authentication/AccountConfirmed.jsx';

const Logout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.clear()
    navigate('/login')
  }, [navigate])

  return null;
}
function App() {
  
  return (
    <Routes>
      
      {/* Landing page (default) */}
      <Route path='/' element={<LandingPage />} />


      {/* Login and Signup */}
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/activate-account' element={<ActivateAccount />} />
      <Route path='/account-activated' element={< AccountConfirmed/>} />

      {/* Patients */}
      <Route path='/patient-dashboard' element={<Dashboard />} />
      <Route path='/main-Dashboard' element={<M_Dashboard />} />
      <Route path='/patient-caregivers' element={<PatientCaregivers caregiver={false} token = {localStorage.getItem('token')} />} /> 
      <Route path='patient-report' element={<VitalsGraph/>} />

      {/* Caregiver Dashboard*/}
      <Route path='/caregiver-dashboard' element={<PatientCaregivers caregiver={true} token={localStorage.getItem('token')} />} />
      <Route path='/caregiver/view-vitals' element={<Dashboard />} />

      {/* Logout */}
      <Route path='/logout' element={<Logout />} />
    </Routes>

  );
}

export default App;