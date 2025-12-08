import React from "react";


export default function LoadingState({ title = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-[#0046A5] border-t-transparent rounded-full animate-spin"></div>
      {/* Title */}
      <p className="mt-4 text-[#0046A5] font-semibold">{title}</p>
      {/* Skeleton list preview */}
      <div className="mt-6 w-full max-w-md space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 bg-gray-200 rounded-lg animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  );
}