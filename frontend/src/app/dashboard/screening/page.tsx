"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ScreeningPage() {
  const [resume, setResume] = useState<File | null>(null);
  const [jobRequirement, setJobRequirement] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const screenResume = async () => {
    if (!resume || !jobRequirement) return;

    setLoading(true);
    setResult(null);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      alert("Not authenticated");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("resume_file", resume);
    formData.append("job_requirement", jobRequirement);
    formData.append("user_id", userData.user.id);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/screen`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Screening failed");
      }

      const data = await res.json();
      setResult(data);

    } catch (error) {
      alert("Screening failed. Check backend.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold">
        Resume Screening
      </h1>

      <div className="bg-white p-6 rounded shadow space-y-5">
        {/* Resume Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Upload Resume (PDF)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setResume(e.target.files?.[0] || null)}
            className="block w-full border rounded px-3 py-2"
          />
        </div>

        {/* Job Requirement */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Job Requirement
          </label>
          <textarea
            rows={4}
            value={jobRequirement}
            onChange={(e) => setJobRequirement(e.target.value)}
            className="block w-full border rounded px-3 py-2"
            placeholder="e.g. Marketing Manager with 5 years experience"
          />
        </div>

        {/* Submit */}
        <button
          onClick={screenResume}
          disabled={loading}
          className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Screening..." : "Screen Resume"}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="bg-white p-6 rounded shadow space-y-4">
          <h2 className="font-medium text-lg">
            Screening Result
          </h2>

          <div
            className={`inline-block px-4 py-2 rounded text-white font-semibold ${
              result.decision === "HIRED"
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          >
            {result.decision}
          </div>

          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
            {JSON.stringify(result.reason, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
