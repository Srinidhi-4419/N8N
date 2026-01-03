import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import "dotenv/config";

import {
  connectDB,
  ExecutionModel,
  NodesModel,
  UserModel,
  WorkflowModel
} from "db";

import {
  CreateWorkflowSchema,
  SignupSchema
} from "common/types";

import { authMiddleware } from "./middleware.js";

const app = express();

/* ===================== ENV VALIDATION ===================== */
const MONGO_URL = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGO_URL) throw new Error("MONGO_URL missing");
if (!JWT_SECRET) throw new Error("JWT_SECRET missing");
await connectDB(MONGO_URL);
console.log("MongoDB connected (server)");
app.use(cors())
app.use(express.json())

app.post("/signup",async(req,res)=>{
    const {success,data}=SignupSchema.safeParse(req.body);
    if(!success){
        res.status(403).json({
            message:"Incorrect Inputs"
        })
        return;
    }
    try{
        const user=await UserModel.create({
            username:data.username,
            password:data.password
        })
    
        res.json({
            id:user._id
        })
    }catch(e){
        res.status(411).json({
            message:"Username already exsists"
        })
    }
})  
app.post("/signin", async (req, res) => {
  const { success, data } = SignupSchema.safeParse(req.body);

  if (!success) {
    res.status(403).json({ message: "Incorrect Inputs" });
    return;
  }

  try {
    const user = await UserModel.findOne({
      username: data.username,
      password: data.password
    });

    if (!user) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET!);
    res.json({ token });

  } catch(error) {
      console.error("Signin error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/nodes/:type", async (req, res) => {
  try {
    const node = await NodesModel.findOne({ type: req.params.type }).lean();
    if (!node) return res.status(404).json({ message: "Node not found" });
    res.json(node);
  } catch {
    res.status(500).json({ message: "Failed to fetch node" });
  }
});
app.post("/workflow",authMiddleware,async(req:any,res)=>{
    const userId=req.userid;
    const {success,data}=CreateWorkflowSchema.safeParse(req.body);
    console.log("BODY:", req.body);
  console.log("USERID:", req.userid);
    if(!success){
        res.status(403).json({
            message:"Incorrect Inputs"
        })
        return;
    }
    
    try{
        const workflow=await WorkflowModel.create({
            userId,
            nodes:data.nodes,
            edges:data.edges
        })
        res.json({
            id:workflow._id
        })
    }catch(e){
      console.error("Workflow create error:", e);
            res.status(411).json({
                message:"Failed to craete workflow"
            })
    }
})
app.get("/workflow/:workflowid",authMiddleware,async(req,res)=>{
    const workflow=await WorkflowModel.findById(req.params.workflowid);
    if(!workflow){
        res.status(404).json({
            message:"workflow not found"
        })
        return;
    }
    res.json(workflow);
})
app.put("/workflow/:workflowid", authMiddleware, async (req: any, res) => {
  const userId = req.userid;
  const workflowId = req.params.workflowid;

  const { success, data } = CreateWorkflowSchema.safeParse(req.body);

  if (!success) {
    res.status(403).json({
      message: "Incorrect Inputs"
    });
    return;
  }

  try {
    const updatedWorkflow = await WorkflowModel.findOneAndUpdate(
      { _id: workflowId, userId }, // ownership check
      {
        nodes: data.nodes,
        edges: data.edges
      },
      { new: true } // return updated document
    );

    if (!updatedWorkflow) {
      res.status(404).json({
        message: "Workflow not found or unauthorized"
      });
      return;
    }

    res.json({
      message: "Workflow updated successfully",
      workflow: updatedWorkflow
    });

  } catch (e) {
    res.status(500).json({
      message: "Failed to update workflow"
    });
  }
});

app.get("/workflow/executions/:workgflowId",authMiddleware,async(req,res)=>{
    const executions=await ExecutionModel.find({workflowId:req.params.workgflowId});
    res.json(executions)
})
app.get("/workflows",authMiddleware,async(req:any,res)=>{
    const workflow=await WorkflowModel.find({userId:req.userid});
    console.log("reached here");
    return res.json(workflow);
;
})
app.get("/nodes",authMiddleware,async(req,res)=>{
    const nodes=await NodesModel.find();
    return res.json(nodes);
})
app.listen(3000,()=>{
    console.log("App listening on port 3000")
});