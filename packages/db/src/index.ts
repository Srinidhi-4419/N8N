import mongoose,{Schema} from 'mongoose'
const userschema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})

const EdgeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: true,
    },
  },
  {
    _id: false, // disable automatic _id for subdocuments
  }
);
const positionSchema=new mongoose.Schema({
    x:{
        type:Number,
        required:true
    },
    y:{
        type:Number,
        required:true
    },
},{
    _id:false
})
const NodeDataSchema=new mongoose.Schema({
    kind:{
        type:String,
        enum:["TRIGGER","ACTION"]
    },
    metadata:Schema.Types.Mixed
},{
    _id:false
})
const  workflownodesSchema=new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    position:positionSchema,
    credentials:Schema.Types.Mixed,
    nodeId: {
        type: String,          // "timer", "lighter"
        required: true
     },

   data:NodeDataSchema,
},{
    _id:false
})
const WorkflowSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required: true
    },
    nodes:[workflownodesSchema],
    edges:[EdgeSchema]
})

const CredentialTypeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  required: { type: Boolean, required: true }
}, { _id: false });

const NodeFieldSchema = new Schema({
  kind: { type: String, enum: ["string", "number", "select", "boolean"], required: true },
  title: { type: String, required: true },
  key: { type: String, required: true },
  description: { type: String },
  values: [String],
  required: { type: Boolean, default: false }
}, { _id: false });

const NodesSchema = new Schema({
  // UNIQUE MACHINE ID (lighter, hyperliquid, backpack, timer…)
  type: { type: String, required: true },  

  // ACTION or TRIGGER
  kind: { type: String, enum: ["ACTION", "TRIGGER"], required: true },

  // For UI display
  title: { type: String, required: true },
  description: { type: String, required: true },

  // "default" (from seed) or "admin"
  source: { type: String, default: "default" },

  // credentials the node requires
  credentialsType: [CredentialTypeSchema],

  // metadataSchema defines what fields UI should show
  metadataSchema: [NodeFieldSchema],

  category: { type: String }
}, { timestamps: true });

const ExecutionSchema = new Schema({
  workflowId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workflows",
    required: true
  },

  status: {
    type: String,
    enum: ["Pending", "Success", "Failure"],
    default: "Pending"
  },

  startTime: {
    type: Date,
    default: Date.now,
    required: true
  },

  endTime: {
    type: Date
  }
});

export const UserModel=mongoose.model("User",userschema);
export const WorkflowModel=mongoose.model("Workflows",WorkflowSchema)
export const NodesModel=mongoose.model("Nodes",NodesSchema)
export const ExecutionModel=mongoose.model("Executions",ExecutionSchema)