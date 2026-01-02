"use client";

import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { Sheet } from "@/components/ui/sheet";
import { TriggerSheet } from "../components/TriggerSheet";
import { ActionSheet } from "../components/ActionSheet";

import { PriceTrigger } from "../components/nodes/triggers/PriceTrigger";
import { Timer } from "../components/nodes/triggers/Timer";
import { Lighter } from "../components/nodes/actions/Lighter";
import { Hyperliquid } from "../components/nodes/actions/Hyperliquid";
import { Backpack } from "../components/nodes/actions/Backpack";

import { apiCreateWorkflow } from "../lib/http";
import { useNavigate } from "react-router-dom";

export type NodeKind =
  | "price-trigger"
  | "timer"
  | "hyperliquid"
  | "backpack"
  | "lighter";

export const nodeTypes = {
  "price-trigger": PriceTrigger,
  timer: Timer,
  lighter: Lighter,
  backpack: Backpack,
  hyperliquid: Hyperliquid,
};

interface NodeType {
  id: string;
  type: NodeKind;
  data: {
    kind: "ACTION" | "TRIGGER";
    metadata: any;
  };
  position: { x: number; y: number };
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

export default function CreateWorkflow() {
  const navigate = useNavigate();

  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [sheetOpen, setSheetOpen] = useState(true);

  const [selectAction, setSelectAction] = useState<{
    position: { x: number; y: number };
    startingnodeid: string;
  } | null>(null);

  const [published, setPublished] = useState(false);
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  console.log("this is nodes",nodes)
  const onNodesChange = useCallback(
    (changes: any) =>
      setNodes((snapshot) => applyNodeChanges(changes, snapshot)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: any) =>
      setEdges((snapshot) => applyEdgeChanges(changes, snapshot)),
    []
  );

  const onConnect = useCallback(
    (params: any) => setEdges((snapshot) => addEdge(params, snapshot)),
    []
  );

  const onConnectEnd = useCallback((event: any, params: any) => {
    if (event.isTrusted) {
      setSelectAction({
        startingnodeid: params.fromNode.id,
        position: params.from,
      });
    }
  }, []);

  async function handlePublish() {
  if (!nodes.length) {
    alert("Add a trigger before publishing!");
    return;
  }

  const body = {
    nodes: nodes.map((n) => ({
      // required by CreateWorkflowSchema
      nodeId: n.type ?? n.id,   // machine id (lighter) or other string identifier
      id: n.id,                 // unique instance id on canvas
      data: {
        kind: n.data.kind.toUpperCase(),     // "action" | "trigger" (must be lowercase)
        metadata: n.data.metadata ?? {},
      },
      credentials: n.data?.credentials ?? {}, // must be present (z.any)
      position: n.position,
    })),
    edges: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
    })),
  };

  try {
    const res = await apiCreateWorkflow(body);
    setWorkflowId(res.id);
    setPublished(true);
  } catch (err) {
    console.error("publish failed", err);
    // optionally show user a readable message:
    const message =
      err?.response?.data?.message ?? "Failed to publish workflow";
    alert(message);
  }
}

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-100">
      {/* HEADER */}
      <header className="h-14 bg-white border-b flex items-center justify-between px-6 shadow-sm">
        <h1 className="text-xl font-bold tracking-tight">Create Workflow</h1>

        {!published && (
          <button
            onClick={handlePublish}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Publish
          </button>
        )}
      </header>

      {/* CANVAS AREA */}
      <div className="flex-1 relative">
        {/* Published Overlay */}
        {published && (
          <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center z-50">
            <h2 className="text-2xl font-semibold">Workflow Published</h2>
            <p className="text-gray-600 mt-2">
              Your workflow has been successfully created.
            </p>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => navigate(`/workflow/${workflowId}/executions`)}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Open Executions
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!nodes.length && !published && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white p-6 rounded-xl shadow-lg border text-center pointer-events-auto">
              <h2 className="text-xl font-semibold">
                Start by selecting a Trigger
              </h2>
              <p className="text-gray-500 mt-1 mb-4">
                Your automation begins with a trigger node.
              </p>

              <button
                onClick={() => setSheetOpen(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Choose Trigger
              </button>
            </div>
          </div>
        )}

        {/* ReactFlow Canvas */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={!published ? onNodesChange : undefined}
          onEdgesChange={!published ? onEdgesChange : undefined}
          onConnect={!published ? onConnect : undefined}
          onConnectEnd={!published ? onConnectEnd : undefined}
          fitView
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Controls />
        </ReactFlow>
      </div>

      {/* Trigger Sheet */}
      {!nodes.length && (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <TriggerSheet
            onSelect={({ type, metadata }) => {
              setNodes([
                {
                  id: crypto.randomUUID(),
                  type,
                  data: { kind: "trigger", metadata },
                  position: { x: 250, y: 120 },
                },
              ]);
              setSheetOpen(false);
            }}
          />
        </Sheet>
      )}

      {/* Action Sheet */}
      {selectAction && !published && (
        <Sheet open={true} onOpenChange={() => setSelectAction(null)}>
          <ActionSheet
            onSelect={({ type, metadata }) => {
              const nodeId = crypto.randomUUID();

              setNodes([
                ...nodes,
                {
                  id: nodeId,
                  type,
                  data: { kind: "action", metadata },
                  position: selectAction.position,
                },
              ]);

              setEdges([
                ...edges,
                {
                  id: `${selectAction.startingnodeid}-${nodeId}`,
                  source: selectAction.startingnodeid,
                  target: nodeId,
                },
              ]);

              setSelectAction(null);
            }}
          />
        </Sheet>
      )}
    </div>
  );
}
