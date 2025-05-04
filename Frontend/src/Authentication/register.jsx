import { useState, useEffect } from 'react';
import backendConnection from '../services/backendConnection';
import { useNavigate } from 'react-router-dom';
import Header from './header';
import Footer from '../Components/footer';


const Register = () => {
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    role: '',
    specialty: '',
    license_number: '',
  });
  const [success, setSuccess] = useState(null);

  const fetchRoles = async () => {
    try {
      const data = await backendConnection.get_roles();
      setRoles(data);
    } catch (error) {
      setError("There was an error fetching the roles.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (e) => {
    setFormData({
      ...formData,
      role: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const data = await backendConnection.register(formData);
      setSuccess(data.success);

      setTimeout(() => {
        localStorage.setItem('email', formData.email)
        navigate('/activate-account')
      }, 2000)
    } catch (error) {
      setError(error.message || "An unknown error has occured. Please cross-check you details or try again later.")
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Registration Form */}
      <section className="py-16 bg-[#EDFCFF] flex items-center justify-center flex-grow">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
          <h2 className="text-4xl font-bold mb-8 text-center text-[#00D9FF]">Register</h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block mb-2 text-gray-700">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#00D9FF]"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block mb-2 text-gray-700">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#00D9FF]"
                required
              />
            </div>

            {/* Username */}
            <div>
              <label className="block mb-2 text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#00D9FF]"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#00D9FF]"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#00D9FF]"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-2 text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#00D9FF]"
                required
              />
            </div>

            {/* Role */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-gray-700">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleRoleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#00D9FF]"
                required
              >
                <option value="">Select a Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor Fields */}
            {roles.find(role => role.id.toString() === formData.role)?.name === 'Doctor' && (
              <>
                <div>
                  <label className="block mb-2 text-gray-700">Specialty</label>
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#00D9FF]"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">License Number</label>
                  <input
                    type="text"
                    name="license_number"
                    value={formData.license_number}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#00D9FF]"
                    required
                  />
                </div>
              </>
            )}

            {error && <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mt-4">{error}</div>}
            {success && <div className="bg-green-100 text-green-700 border border-green-400 px-4 py-3 rounded mt-4">{success}</div>}
            {/* Submit Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-[#00D9FF] text-white py-3 rounded hover:bg-white hover:text-[#00D9FF] border transition"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      < Footer />
    </div>
  );
};

export default Register;
