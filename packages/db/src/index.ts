import { mongoose } from "./mongoose.js";
const { Schema } = mongoose;

/* ===================== User ===================== */
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

/* ===================== Workflow ===================== */
const EdgeSchema = new Schema(
  {
    id: { type: String, required: true },
    source: { type: String, required: true },
    target: { type: String, required: true }
  },
  { _id: false }
);

const PositionSchema = new Schema(
  {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  { _id: false }
);

const NodeDataSchema = new Schema(
  {
    kind: { type: String, enum: ["TRIGGER", "ACTION"] },
    metadata: Schema.Types.Mixed
  },
  { _id: false }
);

const WorkflowNodeSchema = new Schema(
  {
    id: { type: String, required: true },
    position: PositionSchema,
    credentials: Schema.Types.Mixed,
    nodeId: { type: String, required: true },
    data: NodeDataSchema
  },
  { _id: false }
);

const WorkflowSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  nodes: [WorkflowNodeSchema],
  edges: [EdgeSchema]
});

/* ===================== Nodes ===================== */
const CredentialTypeSchema = new Schema(
  {
    title: { type: String, required: true },
    required: { type: Boolean, required: true }
  },
  { _id: false }
);

const NodeFieldSchema = new Schema(
  {
    kind: {
      type: String,
      enum: ["string", "number", "select", "boolean"],
      required: true
    },
    title: { type: String, required: true },
    key: { type: String, required: true },
    description: { type: String },
    values: [String],
    required: { type: Boolean, default: false }
  },
  { _id: false }
);

const NodesSchema = new Schema(
  {
    type: { type: String, required: true }, // unique machine id
    kind: { type: String, enum: ["ACTION", "TRIGGER"], required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    source: { type: String, default: "default" },
    credentialsType: [CredentialTypeSchema],
    metadataSchema: [NodeFieldSchema],
    category: { type: String }
  },
  { timestamps: true }
);

/* ===================== Execution ===================== */
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
  startTime: { type: Date, default: Date.now, required: true },
  endTime: { type: Date }
});

/* ===================== Models (hot-reload safe) ===================== */
export const UserModel =
  mongoose.models.User || mongoose.model("User", UserSchema);

export const WorkflowModel =
  mongoose.models.Workflows || mongoose.model("Workflows", WorkflowSchema);

export const NodesModel =
  mongoose.models.Nodes || mongoose.model("Nodes", NodesSchema);

export const ExecutionModel =
  mongoose.models.Executions || mongoose.model("Executions", ExecutionSchema);

/* ===================== Exports ===================== */
export { connectDB } from "./mongoose.js";
