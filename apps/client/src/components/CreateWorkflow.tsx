import { useState, useCallback } from "react";
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { TriggerSheet } from "./TriggerSheet";
import { PriceTrigger } from "./nodes/triggers/PriceTrigger";
import { Timer } from "./nodes/triggers/Timer";
import { ActionSheet } from "./ActionSheet";
import { Lighter } from "./nodes/actions/Lighter";
import { Hyperliquid } from "./nodes/actions/Hyperliquid";
import { Backpack } from "./nodes/actions/Backpack";
export type TriggerType = "action" | "trigger";
export type NodeKind =
  | "price-trigger"
  | "timer"
  | "hyperliquid"
  | "backpack"
  | "lighter";

interface NodeType {
  id: string;
  type: NodeKind;
  data: {
    kind: "action" | "trigger";
    metadata: any;
    
  };
  position: { x: number; y: number };
}

interface Edge {
  id: string;
  source: string;
  target: string;
}
const nodeTypes={
  "price-trigger":PriceTrigger,
  "timer":Timer,
  "lighter":Lighter,
  "backpack":Backpack,
  "hyperliquid":Hyperliquid,
}

export default function CreateWorkflow() {
  
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectaction,setSelectedAction]=useState<{
    position:{
      x:Number,
      y:number
    },
    startingnodeid:String,
  } | null>(null)
  const onNodesChange = useCallback(
    (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );

  const onConnect = useCallback(
    (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );
  const onConnectEnd = useCallback((event:any, params:any) => {
    console.log("here")
    console.log(params)
    console.log(event)
  if (event.isTrusted) {
    setSelectedAction({
      startingnodeid: params.fromNode.id,
      position:params.from,
    });
  }
}, []);

const [open, setOpen] = useState(true);

  return (
    
    <div style={{ width: "100vw", height: "100vh" }}>
      {!nodes.length && (
        <Sheet open={open} onOpenChange={setOpen} >
          
          <TriggerSheet
            onSelect={({ type, metadata }) => {
             setNodes([
              {
                id: Math.random().toString(),
                type,
                data: {
                  kind: "trigger",
                  metadata,
                },
                position: { x: 0, y: 0 },
              },
            ]);
            }}
          />
        </Sheet>
      )}
      
        {selectaction && (
  <Sheet open={true} onOpenChange={() => setSelectedAction(null)}>
    <ActionSheet
      onSelect={({ type, metadata }) => {
        const nodeid = Math.random().toString();

       setNodes([
             ...nodes, {
              id:nodeid,
                type,
                data: {
                  kind: "action",
                  metadata,
                },
                position: selectaction.position,
              },
            ]);
            console.log(selectaction.position)
            setEdges([...edges,{
              id:`${selectaction.startingnodeid}-${nodeid}`,
              source:selectaction.startingnodeid,
              target:nodeid
            }])
        setSelectedAction(null);
      }}
    
    />
  </Sheet>
)}



      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        fitView
      />
    </div>
  );
}
