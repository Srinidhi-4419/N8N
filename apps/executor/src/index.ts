import { ExecutionModel, WorkflowModel,connectDB } from "db";
import { execute } from "./execute.js";
import "dotenv/config";
const MONGO_URL:any = process.env.MONGO_URL;
await connectDB(MONGO_URL).then(()=>{
  console.log("mongodb connected");
})
async function main() {
  while (true) {
    const workflows = await WorkflowModel.find({});

    await Promise.all(
      workflows.map(async (workflow: any) => {
        const trigger = workflow.nodes.find(
          (node: any) => node.data?.kind === "TRIGGER"
        );

        if (!trigger) return;

        switch (trigger.nodeId) {
          case "timer": {
            const timeInS = trigger.data.metadata.time;

            const execution = await ExecutionModel.findOne({
              workflowId: workflow._id
            }).sort({ startTime: -1 });

            if (!execution || new Date(execution.startTime).getTime() <
              Date.now() - timeInS*1000 ) {
                const execution=await ExecutionModel.create({
                workflowId:workflow.id,
                status:"Pending",
                startTime:new Date()
                });
              await execute(workflow.nodes, workflow.edges);
              execution.endTime=new Date();
              await execution.save();
            } 
            break;
          }

          default:
            break;
        }
      })
    );

    await new Promise((r) => setTimeout(r, 2000)); // prevent CPU burn
  }
}

main().catch(console.error);
