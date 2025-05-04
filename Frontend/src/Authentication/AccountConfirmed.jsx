import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

const AccountConfirmed = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (!email) {
      setError("Email was not provided. Redirecting to registration...");
      setTimeout(() => {
        navigate("/register");
      }, 4000);
    }
  }, [email, navigate]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-sky-100 via-white to-blue-100 p-6">
        <div className="bg-white/70 border border-sky-200 backdrop-blur-md p-10 rounded-xl flex flex-col items-center max-w-md w-full transition duration-500 shadow-lg">
          <h1 className="text-2xl font-semibold text-red-600 mb-4 text-center">Error</h1>
          <p className="text-gray-700 text-center mb-6">{error}</p>
          <p className="text-sm text-gray-500">You will be redirected shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-sky-100 via-white to-blue-100 p-6">
      <div className="bg-white/70 border border-sky-200 backdrop-blur-md p-10 rounded-xl flex flex-col items-center max-w-md w-full transition duration-500 shadow-lg">
        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-5xl mb-4" />

        <h1 className="text-3xl font-semibold text-sky-600 mb-2 text-center">
          Account Confirmed!
        </h1>

        <p className="text-gray-700 text-center mb-6">
          Your account has been successfully activated. <br />
          You can now log in and start using VitaLink.
        </p>

        <Link to="/login">
          <button className="bg-[#00D9FF] text-white px-6 py-2 rounded-full hover:bg-white hover:text-[#00D9FF] border border-[#00D9FF] transition duration-300">
            Go to Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AccountConfirmed;
