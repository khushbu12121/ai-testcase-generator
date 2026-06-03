"use client";

import { useState } from "react";

interface RequirementFormProps {
  onGenerate: (requirement: string) => void;
  onFileResult: (testCases: string) => void;
}

export default function RequirementForm({
  onGenerate,
  onFileResult,
}: RequirementFormProps) {
  const [requirement, setRequirement] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleGenerate = () => {
    if (!requirement.trim()) return;

    onGenerate(requirement);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a TXT file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/upload-requirement",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      alert(JSON.stringify(data));
      console.log("FULL RESPONSE:", data);

      console.log(data);

      console.log("TEST CASES:", data.test_cases);

     console.log("RESPONSE =", data);
console.log("TEST CASES =", data.test_cases);

if (data.test_cases) {
  onFileResult(data.test_cases);
} else {
  alert("test_cases field missing");
}
      alert("Test cases generated successfully!");
    } catch (error) {
      console.error(error);
      alert("File upload failed");
    }
  };

  return (
    <div className="mt-10 max-w-4xl mx-auto">
      <label className="block text-lg font-medium mb-2">
        Enter Requirement
      </label>

      <textarea
        value={requirement}
        onChange={(e) => setRequirement(e.target.value)}
        className="w-full border rounded-lg p-4 h-40"
        placeholder="Example: User can login using email and password."
      />

      <button
        onClick={handleGenerate}
        className="mt-4 px-6 py-3 bg-black text-white rounded-lg"
      >
        Generate Test Cases
      </button>

      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold mb-3">
          Upload Requirement File (.txt)
        </h3>

        <input
          type="file"
          accept=".txt"
          onChange={(e) =>
            setFile(e.target.files?.[0] || null)
          }
          className="mb-4"
        />

        <br />

        <button
          onClick={handleFileUpload}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Upload & Generate
        </button>
      </div>
    </div>
  );
}