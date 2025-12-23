import { Handle, Position } from "@xyflow/react";
import {type TimerNodeMetaData} from "../../../common/metadata"
export function Timer({data,isConnectable}:{
    data:{
        metadata:TimerNodeMetaData
    },
    isConnectable:boolean
}){
    return <div className="p-4 border"> 
    Every {data.metadata.time/3600} seconds
        <Handle  type="source" position={Position.Right}></Handle>
        
    </div>
}
export type {TimerNodeMetaData};