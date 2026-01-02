import axios from "axios";
const BASE_URL=(!import.meta as any)?.env?.VITE_API_URL || "http://localhost:3000";
const TOKEN_KEY="auth_token";

export type IdResponse={id:string};
export type SigninResponse={id:string;token:string};

export type WorkflowNode={
    nodeId:string,
    data:{kind:"action" | "trigger";metadata:any};
    credentials?:any;
    id:string;
    position:{x:number;y:number};
    type:string
}
export type WorkflowEdge={
    id:string;
    source:string;
    target:string;
}
export type Workflow={
    _id:string;
    userId:string;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
}
export function setAuthToken(token:string | null){
    if(token) localStorage.setItem(TOKEN_KEY,token);
    else localStorage.removeItem(TOKEN_KEY);
}
export function getAuthToken():string | null{
    return localStorage.getItem(TOKEN_KEY);
}
const api=axios.create({baseURL:BASE_URL});

api.interceptors.request.use((config)=>{
    const token=getAuthToken();
    if(token){
        config.headers=config.headers ?? {};
        (config.headers as any).Authorization=token;
    }
    return config;
})
export async function apiSignup(body:{username:string;password:string}):Promise<IdResponse>{
    const res=await api.post<IdResponse>("/signup",body);
    return res.data;
}
export async function apiSignin(body:{username:string;password:string}):Promise<SigninResponse>{
    const res=await api.post<SigninResponse>("/signin",body);
    return res.data;
}
export async function apiCreateWorkflow(body:any):Promise<IdResponse>{
    console.log(body);
    const res=await api.post("/workflow",body, {
        headers: {
            "Content-Type": "application/json"
        }
  });
    return res.data;
}
export async function apiUpdateWorkflow(workflowId:string,body:any):Promise<IdResponse>{
    const res=await api.put(`/workflow/${workflowId}`,body);
    return res.data;
}
export async function apiGetWorkflow(workflowId:string):Promise<Workflow>{
    const res=await api.get(`/workflow/${workflowId}`);
    return res.data;
}

export async function apiListWorkflows():Promise<Workflow[]>{
    const res=await api.get<Workflow[]>(`/workflows`);
    return res.data;
}
export async function apiListExecutions(workflowId:string):Promise<any[]>{
    const res=await api.get<any[]>(`/workflow/executions/${workflowId}`);
    return res.data;
}
export async function apiListNodes():Promise<any[]>{
    const res=await api.get<any[]>("/nodes");
    return res.data;
}