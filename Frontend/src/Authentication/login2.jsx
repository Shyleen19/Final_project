import React from 'react';

const LoginPage = () => {
  return (
    <div className="flex h-screen bg-blue-100">
      {/* Left Side: Login Form */}
      <div className="w-1/2 h-full bg-white flex flex-col p-20 justify-between relative">
        <div className="w-full flex flex-col">
          <h1 className="text-3xl font-bold mb-6">Login</h1>
          <p className="text-sm mb-2">Welcome Back! Please Enter Your Details</p>
        </div>  
          <form className="w-full">
            {/* Role Selector */}
            <label className="block mb-2 w-[80%] relative">
              <select className="flex justify-center p-4 bg-[#EDFCFF] font-bold w-40 rounded-[12px] pr-8">
                <option>Select Role</option>
                <option>Doctor</option>
                <option>Caregiver</option>
                <option>Patient</option>
              </select>
            </label>
            {/* Email */}
            <div>
              <label className="block text-black mb-1 font-medium">Email</label>
              <input type="email" placeholder="Email" className="w-full border-b-2 border-black py-2 focus:outline-none rounded-b-md" />
            </div>

            {/* Password */}
            <div>
              <label className="block text-black mb-1 font-medium">Password</label>
              <input type="password" placeholder="Password" className="w-full border-b-2 border-black py-2 focus:outline-none rounded-b-md" />
            </div>
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
            Don't have an account? <a href="patient.js" className="text-[#00D9FF]">Sign Up</a>
          </p>
      </div>
          {/* Left side (Logo + Design) */}
          <div className="w-1/2 bg-[#E6FBFF] flex flex-col justify-between items-center p-8 relative">
  {/* Logo */}
  <div className="flex-1 flex items-center justify-center z-10">
          <img src="heart.png" alt="Telemed Heart Care" className="w-80 object-contain" />
        </div>
       {/* Decorative Circles */}
<div className="absolute top-0 left-0 w-40 h-40 bg-[#00D9FF] rounded-br-full overflow-hidden"></div>
<div className="absolute top-0 right-0 w-40 h-40 bg-[#84EAFF] rounded-bl-full overflow-hidden"></div>
<div className="absolute bottom-0 left-0 w-40 h-40 bg-[#002D62] rounded-tr-full overflow-hidden"></div>

        {/* Bottom Nav */}
        <div className="text-sm text-gray-800 flex gap-6 z-10">
          <a href="#">Home</a>
          <a href="#">About us</a>
          <a href="#">Services</a>
          <a href="#">Contact Us</a>
        </div>
      </div>
        
      </div>
  );
};

export default LoginPage;