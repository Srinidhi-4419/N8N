"use client";

import { useEffect, useState } from "react";
import { apiListWorkflows } from "../lib/http";
import {type Workflow } from "../lib/http";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiListWorkflows();
        setWorkflows(data);
      } catch {
        console.log("Failed to load workflows");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

          <button
            onClick={() => navigate("/create-workflow")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create Workflow
          </button>
        </div>

        {loading ? (
          <p>Loading workflows...</p>
        ) : workflows.length === 0 ? (
          <p className="text-gray-600">No workflows found.</p>
        ) : (
          <div className="space-y-4">
            {workflows.map((w) => (
              <div
                key={w._id}
                className="border bg-white p-5 rounded-xl flex items-center justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Workflow #{w._id}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Nodes: {w.nodes.length}, Edges: {w.edges.length}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/workflow/${w._id}`)}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition"
                  >
                    Open
                  </button>

                  <button
                    onClick={() => navigate(`/workflow/${w._id}/executions`)}
                    className="px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-100 transition"
                  >
                    Executions
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
