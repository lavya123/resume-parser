"use client";

import { useState } from "react";

export default function ResumeParserPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const parseResume = async () => {
  if (!file) return;

  setLoading(true);
  setResult(null);

  const formData = new FormData();
  formData.append("resume_file", file);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/parse`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      throw new Error("Backend error");
    }

    const data = await res.json();
    setResult(data);

  } catch (error) {
    alert("Parsing failed. Check backend.");
    console.error(error);

  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">
        Resume Parser
      </h1>

      <div className="bg-white p-6 rounded shadow space-y-4">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={parseResume}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {loading ? "Parsing..." : "Parse Resume"}
        </button>
      </div>

      {result && (
        <div className="bg-white p-6 rounded shadow space-y-2">
          <h2 className="font-medium">Parsed Data</h2>
          <pre className="text-sm bg-gray-100 p-4 rounded overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

console.log("Backend URL:", process.env.NEXT_PUBLIC_BACKEND_URL);
