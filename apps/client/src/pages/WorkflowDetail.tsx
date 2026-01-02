"use client";

import { useEffect, useState } from "react";
import { apiGetWorkflow, type Workflow } from "../lib/http";
import { useNavigate, useParams } from "react-router-dom";
import { Background, BackgroundVariant, Controls, ReactFlow } from "@xyflow/react";
import { nodeTypes } from "./CreateWorkflow";
// import { Background, Controls, ReactFlow } from "@xyflow/react";

export default function WorkflowDetail() {
  const { id } = useParams();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const navigate=useNavigate();
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
  console.log(workflow)
  const rfNodes = workflow?.nodes.map((node) => ({
  ...node,
  type: node.nodeId,
}));

  if (loading) return <p className="p-8">Loading...</p>;
  if (!workflow) return <p className="p-8">Workflow not found</p>;
  return (
    <div className="w-screen h-screen flex flex-col bg-gray-100">
     <div className="flex justify-between p-4">
        <h1 className="font-semibold text-[30px]">Workflow</h1>
        <div className="flex space-x-4">
          <button  className="font-semibold bg-white  p-2 rounded-md cursor-pointer">View Executions</button>
          <button onClick={()=>{navigate('/dashboard')}} className="font-semibold bg-white  p-2 rounded-md cursor-pointer">Back to Dashboard</button>
        </div>
     </div>
    <div className="text-black  pl-4 font-semibold mb-10">
      ID:{id}
    </div>
    <ReactFlow
      nodeTypes={nodeTypes}
      nodes={rfNodes}
      edges={workflow.edges}
      fitView
    >
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
