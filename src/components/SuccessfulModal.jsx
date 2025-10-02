import React from "react";
import { FaCheckCircle } from "react-icons/fa";
const SuccessModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-[90%] max-w-sm">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-4">{message}</h2>
        <button
          onClick={onClose}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
        >
          Okay
        </button>
      </div>
    </div>
  );
};
export default SuccessModal;
