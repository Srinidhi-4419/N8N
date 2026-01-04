import { execute as executeLighter } from "./lighter.js";

export async function execute(nodes: any[], edges: any[]) {
  const trigger = nodes.find(
    (node: any) => node.data?.kind === "TRIGGER"
  );

  if (!trigger) return;

  await executeRecursive(trigger.id, nodes, edges);
}

export async function executeRecursive(
  sourceId: string,
  nodes: any[],
  edges: any[]
) {
  const nodesToExecute = edges
    .filter(({ source }: any) => source === sourceId)
    .map(({ target }: any) => target);

  await Promise.all(
    nodesToExecute.map(async (nodeClientId: string) => {
      const node = nodes.find(({ id }: any) => id === nodeClientId);
      if (!node) return;

      switch (node.nodeId) {
        case "lighter":
          await executeLighter(
            node.data.metadata.asset,
            node.data.metadata.qty,
            node.data.metadata.side,
            node.data.metadata.API_KEY
          );
          break;

        default:
          break;
      }
    })
  );

  await Promise.all(
    nodesToExecute.map((id: string) =>
      executeRecursive(id, nodes, edges)
    )
  );
}
