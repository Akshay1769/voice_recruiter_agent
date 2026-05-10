"use client";

import { useEffect, useState } from "react";

export default function ResumePage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="w-full h-screen relative">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>

            <p className="text-gray-600 font-medium">Loading ATS System...</p>
          </div>
        </div>
      )}

      <iframe
        src="atsmain.up.railway.app"
        className="w-full h-screen border-none"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
