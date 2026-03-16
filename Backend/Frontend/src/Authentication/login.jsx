import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackendConnection from '../services/backendConnection.js';


const LoginPage = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    let data

    try {
      setError(null)
      setSuccess(null)
      const data = await BackendConnection.login(usernameOrEmail, password)
      localStorage.clear()
      BackendConnection.setHeaders(data.token)
      localStorage.setItem('token', data.token)
      localStorage.setItem('username', data.username)
      localStorage.setItem('name', data.name)
      localStorage.setItem('role', data.role)
      sessionStorage.removeItem('chatbot_greeted')
      setSuccess("Successfull login. Redirecting in a few...")

      setTimeout(() => {
        const role = data.role ? data.role.toLowerCase() : '';
        if (role === 'admin') {
          navigate('/main-dashboard')
        } else if (role === 'caregiver') {
          navigate('/caregiver-dashboard')
        } else {
          navigate('/patient-dashboard')
        }
      }, 2000)
    } catch (error) {
      setError(error.message || "An error occured. Please cross check your detail or try again later.")
    } finally {
      if (data) {
        console.log(data)
      }
    }
  }

  return (
    <div className="flex h-screen bg-blue-100">
      {/* Left Side: Login Form */}
      <div className="w-1/2 h-full bg-white flex flex-col p-20 justify-between relative">
        <div className="w-full flex flex-col">
          <h1 className="text-3xl font-bold mb-6">Login</h1>
          <p className="text-sm mb-2">Welcome Back! Please Enter Your Details</p>
        </div>
        <form className="w-full" onSubmit={handleSubmit}>

          {/* Email */}
          <div className='my-5'>
            <label className="block text-black mb-1 font-medium">Username or Email</label>
            <input type="text" placeholder="usernameOrEmail" className="w-full border-b-2 border-black py-2 focus:outline-none rounded-b-md" value={usernameOrEmail} onChange={(e) => (setUsernameOrEmail(e.target.value))} />
          </div>

          {/* Password */}
          <div className='my-5'>
            <label className="block text-black mb-1 font-medium">Password</label>
            <input type="password" placeholder="Password" className="w-full border-b-2 border-black py-2 focus:outline-none rounded-b-md" value={password} onChange={(e) => (setPassword(e.target.value))} />
          </div>

          {error && <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mt-4">{error}</div>}
          {success && <div className="bg-green-100 text-green-700 border border-green-400 px-4 py-3 rounded mt-4">{success}</div>}
          {/* Button */}
          <div className="flex justify-center mt-6">
            <button type="submit" className="bg-[#00D9FF] text-white font-semibold py-2 px-10 rounded-md hover:bg-white hover:text-[#00D9FF] hover:border-[#00D9FF] hover:border transition duration-300">
              Login
            </button>
          </div>
        </form>
        <a href="#" className="text-[#00D9FF] font-semibold py-2 px-10">Forgot Password?</a>
        {/* Login Prompt */}
        <p className="mt-4 text-center text-2xl">
          Don't have an account? <a href="/register" className="text-[#00D9FF]">Register</a>
        </p>
      </div>
      {/* Right side (Logo Image perfectly matched to full width) */}
      <div className="w-1/2 bg-[#00D9FF] flex flex-col items-center justify-between pt-0 pb-12">
        {/* Logo Image - Expanded to full width */}
        <div className="w-full">
          <img
            src="/dialicare_logo.jpg"
            alt="DialiCare"
            className="w-full h-auto border-0 shadow-none object-contain"
          />
        </div>

        {/* Nav Bar Just below CTA - White text for contrast */}
        <div className="flex gap-8 text-white font-bold text-lg">
          <a href="/#home" className="hover:text-[#002D62] transition-colors border-b-2 border-transparent hover:border-[#002D62]">Home</a>
          <a href="/#about" className="hover:text-[#002D62] transition-colors border-b-2 border-transparent hover:border-[#002D62]">About us</a>
          <a href="/#services" className="hover:text-[#002D62] transition-colors border-b-2 border-transparent hover:border-[#002D62]">Services</a>
          <a href="/#contact" className="hover:text-[#002D62] transition-colors border-b-2 border-transparent hover:border-[#002D62]">Contact Us</a>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;