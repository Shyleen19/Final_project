import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import BackendConnection from '../services/backendConnection';
import Header from './header';

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null)
      setSuccess(null)
      const data = await BackendConnection.login(usernameOrEmail, password)
      BackendConnection.setHeaders(data.token)
      localStorage.setItem('token', data.token)
      localStorage.setItem('username', data.username)
      localStorage.setItem('name', data.name)
      localStorage.setItem('role', data.role)
      setSuccess("Successfull login. Redirecting in a few...")

      setTimeout(() => {
        navigate('/patient-dashboard') // navigate to patient's dashboard.
      }, 2000)
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error || "Login Failed")
      } else {
        setError("Something went Wrong.")
      }
    }


  };

  return (
    <div className="min-h-screen flex flex-col">

      <Header login={true} />

      <div className="flex items-center justify-center flex-grow bg-[#EDFCFF]">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#00D9FF]">Login to VitaLink</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700">Username or Email</label>
              <input
                type="text"
                name="usernameOrEmail"
                value={usernameOrEmail}
                onChange={(e) => { setUsernameOrEmail(e.target.value) }}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#00D9FF]"
                placeholder="Enter your username or email"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value) }}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#00D9FF]"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

            <button
              type="submit"
              className="w-full bg-[#00D9FF] text-white py-2 rounded hover:bg-white hover:text-[#00D9FF] border transition"
            >
              Log In
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account? <a href="/register" className="text-[#00D9FF] hover:underline">Sign Up</a>
          </p>
        </div>
      </div>
    </div>

  );
};

export default Login;
