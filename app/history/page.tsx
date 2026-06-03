"use client";

import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const fetchHistory = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/history"
    );

    const data = await response.json();

    setHistory(data.reverse());
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const deleteHistory = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all history?"
    );

    if (!confirmDelete) return;

    await fetch(
      "http://127.0.0.1:8000/history",
      {
        method: "DELETE",
      }
    );

    fetchHistory();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Test Case History
        </h1>

        <button
          onClick={deleteHistory}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete History
        </button>
      </div>

      <input
        type="text"
        placeholder="Search requirement..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg p-3 w-full mb-6"
      />

      {history.length === 0 ? (
        <p className="text-center text-gray-500">
          No history found.
        </p>
      ) : (
        history
          .filter((item) =>
            item.requirement
              ?.toLowerCase()
              .includes(search.toLowerCase())
          )
          .map((item, index) => (
            <div
              key={index}
              className="border rounded-lg p-5 mb-5 shadow-md"
            >
              <h2 className="font-bold text-lg mb-2">
                Requirement
              </h2>

              <p className="mb-2">
                {item.requirement}
              </p>

              {item.created_at && (
                <p className="text-sm text-gray-500 mb-3">
                  {item.created_at}
                </p>
              )}

              <hr className="mb-4" />

              <h2 className="font-bold text-lg mb-2">
                Generated Test Cases
              </h2>

              <pre className="whitespace-pre-wrap text-sm leading-7">
                {item.test_cases}
              </pre>
            </div>
          ))
      )}
    </div>
  );
}