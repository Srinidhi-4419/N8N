import {z} from "zod"

export const SignupSchema=z.object({
    username:z.string().min(3).max(100),
    password:z.string()
})
export const CreateWorkflowSchema=z.object({
    nodes:z.array(z.object({
        nodeId:z.string(),
        data:z.object({
            kind:z.enum(["ACTION","TRIGGER"]),
            metadata:z.any()
        }),
        credentials:z.any(),
        id: z.string(),
        position:z.object({
            x:z.number(),
            y:z.number()
        })
    })),
    edges:z.array(z.object({
        id: z.string(),
        source:z.string(),
        target:z.string()
    }))
})
export const UpdateWoerkflowSchema=z.object({
    nodes:z.array(z.object({
        nodeId:z.string(),
        data:z.object({
            kind:z.enum(["action","trigger"]),
            metadata:z.any()
        }),
        credentials:z.any(),
        id: z.string(),
        position:z.object({
            x:z.number(),
            y:z.number()
        })
    })),
    edges:z.array(z.object({
        id: z.string(),
        source:z.string(),
        target:z.string()
    }))
})
export const NodeFieldSchema = z.object({
  key: z.string().min(1),
  title: z.string().min(1),
  kind: z.enum(["string", "number", "select", "boolean", "json"]),
  description: z.string().optional(),
  values: z.array(z.string()).optional(), // for select
  required: z.boolean().optional().default(false),
});
export const CredentialTypeSchema = z.object({
  key: z.string().optional(),
  title: z.string().min(1),
  required: z.boolean().optional().default(true),
});

/**
 * Node definition
 */
export const NodeDefinitionSchema = z.object({
  type: z.string().min(1), // machine identifier, e.g. "lighter"
  kind:z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  source: z.enum(["default", "admin"]).optional().default("default"),
  credentialsType: z.array(CredentialTypeSchema).optional().default([]),
  metadataSchema: z.array(NodeFieldSchema).optional().default([]),
});