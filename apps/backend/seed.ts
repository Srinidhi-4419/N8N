// scripts/seedNodes.ts
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import "dotenv/config";
import { NodeDefinitionSchema } from "common/types";
import { NodesModel } from "db"; // adjust if your models entry is different

async function main() {
  const mongo = process.env.mongo_url!;
  if (!mongo) throw new Error("mongo_url missing in env");
  await mongoose.connect(mongo);

  const nodesDir = path.resolve(process.cwd(), "nodes");
  if (!fs.existsSync(nodesDir)) {
    console.log("No nodes folder found at ./nodes — skipping seed.");
    process.exit(0);
  }

  const files = fs.readdirSync(nodesDir).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    const filePath = path.join(nodesDir, file);
    const raw = fs.readFileSync(filePath, "utf8");
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error("Invalid JSON:", filePath, e);
      continue;
    }

    const parseRes = NodeDefinitionSchema.safeParse(parsed);
    if (!parseRes.success) {
      console.error("Validation failed for", filePath, parseRes.error.format());
      continue;
    }

    const def = parseRes.data;
    // Upsert by type + version + source=default (update if exists)
await NodesModel.findOneAndUpdate(
  { type: def.type },
  {
    $set: {
      kind: def.kind,                       // ✅ REQUIRED
      type: def.type,
      title: def.title,
      description: def.description,
      credentialsType: def.credentialsType,
      metadataSchema: def.metadataSchema,
      source: def.source,
    },
  },
  { upsert: true, new: true }
);


    console.log("Seeded node:", def.type);
  }

  await mongoose.disconnect();
  console.log("Seeder finished.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
