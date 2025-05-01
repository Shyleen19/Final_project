import { useEffect, useState } from "react";

const ActivateAccount = () => {
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const email = localStorage.getItem('email');

  useEffect(() => {
    if (secondsLeft > 0) {
      const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [secondsLeft]);

  const handleResend = () => {
    console.log(`Resending activation link to ${email}`);
    setSecondsLeft(120);
    setCanResend(false);
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
        </p>

        {!canResend ? (
          <div className="text-gray-500 text-sm">
            You can resend in <span className="font-semibold">{secondsLeft}s</span>
          </div>
        ) : (
          <button
            onClick={handleResend}
            className="mt-4 px-6 py-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 active:bg-sky-700 transition"
          >
            Resend Email
          </button>
        )}
      </div>
    </div>
  );
};

export default ActivateAccount;
