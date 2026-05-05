"use client";

import { useState } from "react";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
  if (!file) return;

  const formData = new FormData();
  formData.append("resume", file);
  formData.append("email", email);

  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    console.log("STATUS:", res.status);

    const data = await res.json();
    console.log("RESPONSE:", data);

    if (!res.ok) {
      setStatus("❌ " + (data.error || "Upload failed"));
      setScore(null);
      return;
    }

    setScore(data.score ?? null);
    setStatus(data.shortlisted ? "✅ Shortlisted" : "❌ Not shortlisted");

  } catch (err) {
    console.error("FETCH ERROR:", err);
    setStatus("❌ Network or server error");
    setScore(null);
  }
};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">ATS Resume Checker</h1>

      <input
        type="email"
                placeholder="Enter email (if not detected)"
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 border p-2"
            />

      <input
        type="file"
        onChange={(e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) setFile(file);
        }}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        className="bg-indigo-500 text-white px-4 py-2 rounded"
      >
        Upload Resume
      </button>

      {typeof score === "number" && (
        <div className="mt-4">
          <p>ATS Score: {score.toFixed(2)}%</p>
          <p>{status}</p>
        </div>
      )}
    </div>
  );
}
