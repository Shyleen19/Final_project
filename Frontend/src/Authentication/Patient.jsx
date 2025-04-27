import React from 'react';

const PatPage = () => {
  return (
    <div className="flex h-screen w-full font-sans overflow-hidden">
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

      {/* Right side (Form) */}
      <div className="w-1/2 bg-white flex items-center justify-center">
        <div className="w-full max-w-md p-10">
          <h2 className="text-4xl font-bold text-black mb-8 text-center">Sign Up</h2>

          <form className="space-y-6">
            {/* Role Selector */}
            <label className="block mb-2 w-[80%] relative">
              <select className="flex justify-center p-4 bg-[#EDFCFF] font-bold w-40 rounded-[12px] pr-8">
                <option>Select Role</option>
                <option>Doctor</option>
                <option>Caregiver</option>
                <option>Patient</option>
              </select>
            </label>

            {/* Full Name */}
            <div>
              <label className="block text-black mb-1 font-medium">Full Name</label>
              <input type="text" placeholder="Full Name" className="w-full border-b-2 border-black py-2 focus:outline-none rounded-b-md" />
            </div>

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

            {/* Confirm Password */}
            <div>
              <label className="block text-black mb-1 font-medium">Confirm password</label>
              <input type="password" placeholder="Confirm password" className="w-full border-b-2 border-black py-2 focus:outline-none rounded-b-md" />
            </div>

            {/* Button */}
            <div className="flex justify-center mt-6">
              <button type="submit" className="bg-[#00D9FF] text-white font-semibold py-2 px-10 rounded-md hover:bg-white hover:text-[#00D9FF] hover:border-[#00D9FF] hover:border transition duration-300">
                Sign Up
              </button>
            </div>
          </form>

          {/* Login Prompt */}
          <p className="mt-4 text-center text-2xl">
            Already have an account? <a href="login.js" className="text-[#00D9FF]">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatPage ;
