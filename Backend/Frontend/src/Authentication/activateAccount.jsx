import { useEffect, useState } from "react";
import backendConnection from "../services/backendConnection";

const ActivateAccount = () => {
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const email = localStorage.getItem('email');
  const [response, setResponse] = useState('');

  useEffect(() => {
    if (secondsLeft > 0) {
      const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [secondsLeft]);

  const handleResend = async () => {
    try {
      const result = await backendConnection.resendEmail(localStorage.getItem('email'));
      setResponse("✅✅" + result.success);
      setCanResend(false);
      setSecondsLeft(60); // restart timer
    } catch (error) {
      setResponse("❌ " + (error.message || "An error occurred."));
    } finally {
      setTimeout(() => setResponse(''), 10000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-sky-100 via-white to-blue-100 p-6">
      <div className="bg-white/60 border border-sky-200 backdrop-blur-md p-8 rounded-xl flex flex-col items-center max-w-md w-full transition duration-500">
        <h1 className="text-3xl font-semibold text-sky-600 mb-3 text-center">
          Check Your Email
        </h1>
        <p className="text-gray-700 text-center mb-6 leading-relaxed">
          We've sent a link to
          <br />
          <span className="text-sky-500 font-medium">{email}</span>
          . Please click the link to activate your account.
        </p>

        {!canResend ? (
          <div className="text-gray-500 text-sm mb-4">
            You can resend in <span className="font-semibold">{secondsLeft}s</span>
          </div>
        ) : (
          <button
            onClick={handleResend}
            className="mt-2 px-6 py-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 active:bg-sky-700 transition mb-4"
          >
            Resend Email
          </button>
        )}

        {response && (
          <div className={`text-center px-4 py-2 rounded text-sm ${
            response.includes("✅") ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
          }`}>
            {response}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivateAccount;
