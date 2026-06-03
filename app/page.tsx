"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import Link from "next/link";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import Navbar from "../components/Navbar";
import RequirementForm from "../components/RequirementForm";
import TestCaseResults from "../components/TestCaseResults";
import { generateTestCases as generateTestCasesAPI } from "../services/testCaseService";

export default function Home() {
  const [testCases, setTestCases] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState("");

  const generateTestCases = async (requirement: string) => {
    if (!requirement || !requirement.trim()) return;

    setLoading(true);

    try {
      const data = await generateTestCasesAPI(requirement);

      setSource(data.source || "");

      if (data.error) {
        alert(data.error);
        return;
      }

      if (typeof data.test_cases === "string") {
        setTestCases([data.test_cases]);
      } else {
        setTestCases(data.test_cases || []);
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Backend connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileResult = (generatedText: string) => {
    setSource("file-upload");
    setTestCases([generatedText]);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Generated Test Cases", 10, 10);

    let y = 20;

    testCases.forEach((testCase) => {
      const lines = doc.splitTextToSize(testCase, 180);

      doc.text(lines, 10, y);

      y += lines.length * 8;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("test-cases.pdf");
  };

  const downloadExcel = () => {
    const data = testCases.map((testCase, index) => ({
      "Test Case No": index + 1,
      "Test Case": testCase,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Test Cases"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    saveAs(fileData, "test-cases.xlsx");
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(
      testCases.join("\n")
    );

    alert("Test cases copied successfully!");
  };

  return (
    <>
      <Navbar />

      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-center mb-6">
          Generate AI Test Cases
        </h2>

        <div className="flex justify-center gap-4 mb-6">
          <Link href="/history">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              View History
            </button>
          </Link>
        </div>

        <RequirementForm
          onGenerate={generateTestCases}
          onFileResult={handleFileResult}
        />

        {source && (
          <div className="text-center mt-4">
            <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-medium">
              Source: {source}
            </span>
          </div>
        )}

        {loading && (
          <p className="text-center mt-6 font-semibold">
            Generating test cases...
          </p>
        )}

        {testCases.length > 0 && (
          <>
            <div className="flex justify-center gap-4 mt-6 mb-4 flex-wrap">
              <button
                onClick={downloadPDF}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Download PDF
              </button>

              <button
                onClick={downloadExcel}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Download Excel
              </button>

              <button
                onClick={copyToClipboard}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Copy Test Cases
              </button>
            </div>

            <TestCaseResults testCases={testCases} />
          </>
        )}
      </main>
    </>
  );
}