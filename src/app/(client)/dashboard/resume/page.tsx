"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResumePage() {
  const [loaded, setLoaded] = useState(false);
  const [orgId, setOrgId] = useState("");

  const { user } = useUser();

  useEffect(() => {
    async function fetchOrgId() {
      if (!user) return;

      const { data, error } = await supabase
        .from("user")
        .select("organization_id")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      if (data?.organization_id) {
        setOrgId(data.organization_id);
      }
    }

    fetchOrgId();
  }, [user]);

  if (!orgId) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading organization...
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>

            <p className="text-gray-600 font-medium">
              Loading ATS System...
            </p>
          </div>
        </div>
      )}

      <iframe
        src={`https://streamlit-proxy-szp0.onrender.com/?org=${orgId}`}
        className="w-full h-screen border-none"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
