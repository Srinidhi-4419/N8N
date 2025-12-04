import { Handle, Position } from "@xyflow/react";
import {type PriceNodeMetaData} from "common/types"
export function PriceTrigger({data,isConnectable}:{
    data:{
        metadata:PriceNodeMetaData
    },
    isConnectable:boolean
}){
    return <div className="p-4 border"> 
    {data.metadata.asset}
    {data.metadata.price}
        <Handle  type="source" position={Position.Right}></Handle>
    </div>
}