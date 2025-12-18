"use client";

import { useEffect, useState } from "react";
import { apiListExecutions } from "../lib/http";
import { useParams } from "react-router-dom";

export default function WorkflowExecutions() {
  const { id } = useParams();
  const [executions, setExecutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiListExecutions(id!);
        setExecutions(data);
      } catch {
        console.log("Failed to load executions");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-6">Workflow Executions</h1>

        {executions.length === 0 ? (
          <p className="text-gray-600">No executions found.</p>
        ) : (
          <div className="space-y-4">
            {executions.map((ex) => (
              <div
                key={ex._id}
                className="border p-4 rounded-lg bg-gray-50"
              >
                <p className="font-semibold">Execution ID: {ex._id}</p>
                <p>Status: {ex.status}</p>
                <p>Start: {new Date(ex.startTime).toLocaleString()}</p>
                {ex.endTime && (
                  <p>End: {new Date(ex.endTime).toLocaleString()}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
