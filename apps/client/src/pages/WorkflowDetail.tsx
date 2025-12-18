"use client";

import { useEffect, useState } from "react";
import { apiGetWorkflow, type Workflow } from "../lib/http";
import { useParams } from "react-router-dom";

export default function WorkflowDetail() {
  const { id } = useParams();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiGetWorkflow(id!);
        setWorkflow(data);
      } catch {
        console.log("Failed to load workflow");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <p className="p-8">Loading...</p>;
  if (!workflow) return <p className="p-8">Workflow not found</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-4">Workflow Detail</h1>

        <p className="text-gray-600 mb-6">
          Workflow ID: {workflow._id}
        </p>

        <h2 className="text-xl font-semibold mb-2">Nodes</h2>
        <div className="space-y-3 mb-8">
          {workflow.nodes.map((node) => (
            <div key={node.id} className="border p-4 rounded-lg bg-gray-50">
              <p className="font-semibold">Node ID: {node.id}</p>
              <p>Node Type: {node.data.kind}</p>
              <p>Template ID: {node.nodeId}</p>
              <p>Position: ({node.position.x}, {node.position.y})</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-2">Edges</h2>
        <div className="space-y-3">
          {workflow.edges.map((edge) => (
            <div key={edge.id} className="border p-4 rounded-lg bg-gray-50">
              <p className="font-semibold">Edge ID: {edge.id}</p>
              <p>Source: {edge.source}</p>
              <p>Target: {edge.target}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
