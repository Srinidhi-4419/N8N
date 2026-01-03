// scripts/seedNodes.ts
import fs from "fs";
import path from "path";
import "dotenv/config";

import { NodeDefinitionSchema } from "common/types";
import { NodesModel, connectDB } from "db"; // ✅ use db connector

async function main() {
  const mongo = process.env.MONGO_URL; // ✅ correct env name
  if (!mongo) throw new Error("MONGO_URL missing in env");

  await connectDB(mongo); // ✅ db owns mongoose

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

    await NodesModel.findOneAndUpdate(
      { type: def.type },
      {
        $set: {
          kind: def.kind,
          type: def.type,
          title: def.title,
          description: def.description,
          credentialsType: def.credentialsType,
          metadataSchema: def.metadataSchema,
          source: def.source
        }
      },
      { upsert: true, new: true }
    );

    console.log("Seeded node:", def.type);
  }

  console.log("Seeder finished.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
