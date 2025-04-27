
import {useNavigate} from 'react-router-dom'
import {Routes, Route } from 'react-router-dom'
import './index.css';
import Dashboard from './Patients_Dashboard/Dashboard.jsx';
import Caregiver from './Patients_Caregivers/Caregiver.jsx';
import LandingPage from './LandingPage/LandingPage.jsx';
import Login from './Authentication/login.jsx';
import LoginPage from './Authentication/login2.jsx';
import { useEffect } from 'react';
import Register from './Authentication/register.jsx';

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
      {/* Login and Signup */}
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<Register />} />

      {/* Caregiver Login and Signup */}
      {/* Landing page (default) */}
      <Route path='/' element={<LandingPage />} />

      {/* Patient Dashboard*/}
      <Route path='/patient-dashboard' element={<Dashboard />} />

      {/* Caregiver Dashboard*/}
      <Route path='/caregivers' element={<Caregiver />} />

      {/* Logout */}
      <Route path='/logout' element={<Logout />} />
    </Routes>

  );
}

export default App;