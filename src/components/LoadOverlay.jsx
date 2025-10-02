import React from "react";
const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="text-green-600 text-6xl font-bold animate-pulse">
        Q
      </div>
    </div>
  );
};
export default LoadingOverlay;