"use client";

import React from "react";
import { BarChart3, PlayCircleIcon, SpeechIcon ,Upload } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

function SideMenu() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="z-[10] bg-slate-100 p-3 md:p-6 w-[80px] md:w-[200px] fixed top-[64px] left-0 h-full">
      <div className="flex flex-col gap-1">
        <div className="flex flex-col justify-between gap-2">
          <div
            className={`flex flex-row p-3 rounded-md hover:bg-slate-200 cursor-pointer ${
              pathname.endsWith("/dashboard") ||
              pathname.includes("/interviews")
                ? "bg-indigo-200"
                : "bg-slate-100"
            }`}
            onClick={() => router.push("/dashboard")}
          >
            <PlayCircleIcon className="font-thin	 mr-2" />
            <p className="font-medium hidden md:block">
                  Interviews
                </p>
          </div>




          <div
            className={`flex flex-row p-3 rounded-md hover:bg-slate-200 cursor-pointer ${
              pathname.endsWith("/interviewers")
                ? "bg-indigo-200"
                : "bg-slate-100"
            }`}
            onClick={() => router.push("/dashboard/interviewers")}
          >
            <SpeechIcon className="font-thin mr-2" />
            <p className="font-medium hidden md:block">
                  Interviewers
                </p>
          </div>



           <div
            className={`flex flex-row p-3 rounded-md hover:bg-slate-200 cursor-pointer ${
              pathname.endsWith("/resume")
                ? "bg-indigo-200"
                : "bg-slate-100"
            }`}
            onClick={() => router.push("/dashboard/resume")}
          >
            <Upload className="mr-2" />
            <p className="font-medium hidden md:block">
                  Add Resume
                </p>
          </div>

          <div
            className={`flex flex-row p-3 rounded-md hover:bg-slate-200 cursor-pointer ${
              pathname.endsWith("/analytics")
                ? "bg-indigo-200"
                : "bg-slate-100"
            }`}
            onClick={() => router.push("/dashboard/analytics")}
          >
            <BarChart3 className="mr-2" />
            <p className="font-medium hidden md:block">
                  Analytics
                </p>
          </div>

                
         
        </div>
      </div>
    </div>
  );
}

export default SideMenu;
