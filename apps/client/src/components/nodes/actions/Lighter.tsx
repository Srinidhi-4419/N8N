import { type TradingMetadata } from "common"
import { Handle, Position } from "@xyflow/react"

export function Lighter({data}:{
    data:{
        metadata:TradingMetadata
    }
}){
    console.log(data)
    return <div className="p-4 border bg-white rounded-md">
        <span className="font-semibold">Lighter trade</span>
        <div>Type:{data.metadata.side}</div>
        <div>Qty:{data.metadata.qty}</div>
        <div>Symbol:{data.metadata.asset}</div>
        <Handle type="source" position={Position.Right}></Handle>
        <Handle type="target" position={Position.Left}></Handle>
    </div>
}

export type { TradingMetadata }
