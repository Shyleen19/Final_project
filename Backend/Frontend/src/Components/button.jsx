import React from "react";

export default function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded font-semibold transition duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
