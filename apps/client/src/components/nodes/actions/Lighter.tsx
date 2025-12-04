import { type TradingMetadata } from "common/types"
import { Handle, Position } from "@xyflow/react"

export function Lighter({data}:{
    data:{
        metadata:TradingMetadata
    }
}){
    return <div className="p-4 border">
        Lighter Trade
        <div>{data.metadata.type}</div>
        <div>{data.metadata.qty}</div>
        <div>{data.metadata.symbol}</div>
        <Handle type="source" position={Position.Right}></Handle>
        <Handle type="target" position={Position.Left}></Handle>
    </div>
}