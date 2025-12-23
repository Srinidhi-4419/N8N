import { useState, useEffect } from "react";
import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";

import { apiListNodes } from "../lib/http";

export function ActionSheet({
  onSelect,
}: {
  onSelect: (data: { type: string; metadata: any }) => void;
}) {
  const [nodes, setNodes] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [metadata, setMetadata] = useState<Record<string, any>>({});

  useEffect(() => {
    async function loadNodes() {
      const allNodes = await apiListNodes();
      console.log(allNodes)
      // Only ACTION-type nodes
      const actionNodes = allNodes.filter((n) => n.kind === "ACTION");

      setNodes(actionNodes);

      if (actionNodes.length > 0) {
        setSelected(actionNodes[0].type); // select machine ID like "lighter"
      }
    }

    loadNodes();
  }, []);

  const selectedNode = nodes.find((n) => n.type === selected);

  function renderField(field: any) {
    const key = field.key;

    // SELECT DROPDOWN
    if (field.kind === "select") {
      return (
        <div key={key} className="mt-4">
          <label className="block mb-1 font-medium">{field.title}</label>

          <Select
            value={metadata[key]}
            onValueChange={(value) =>
              setMetadata((m) => ({ ...m, [key]: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={field.description || "Choose"} />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {field.values?.map((v: string) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      );
    }

    // NUMBER INPUT
    if (field.kind === "number") {
      return (
        <div key={key} className="mt-4">
          <label className="block mb-1 font-medium">{field.title}</label>

          <Input
            type="number"
            placeholder={field.description}
            onChange={(e) =>
              setMetadata((m) => ({ ...m, [key]: Number(e.target.value) }))
            }
          />
        </div>
      );
    }

    // STRING INPUT
    if (field.kind === "string") {
      return (
        <div key={key} className="mt-4">
          <label className="block mb-1 font-medium">{field.title}</label>

          <Input
            type="text"
            placeholder={field.description}
            onChange={(e) =>
              setMetadata((m) => ({ ...m, [key]: e.target.value }))
            }
          />
        </div>
      );
    }

    return null;
  }

  return (
    <SheetContent className="w-[450px]">
      <SheetHeader>
        <SheetTitle>Select Action</SheetTitle>
        <SheetDescription>Configure your action parameters.</SheetDescription>
      </SheetHeader>

      {/* ACTION SELECTOR */}
      <div className="mt-4">
        <label className="font-medium block mb-1">Action Type</label>

        <Select value={selected} onValueChange={setSelected}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select action" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {nodes.map((node) => (
                <SelectItem key={node.type} value={node.type}>
                  {node.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* DYNAMIC METADATA UI FIELDS */}
      {selectedNode?.metadataSchema?.map((field: any) => renderField(field))}
              {/* CREDENTIAL FIELDS */}
{selectedNode?.credentialsType?.length > 0 && (
  <div className="mt-6">
    <h3 className="font-semibold mb-2">Credentials</h3>

    {selectedNode.credentialsType.map((cred: any) => (
      <div key={cred.title} className="mt-3">
        <label className="block mb-1 font-medium">
          {cred.title} {cred.required ? "*" : ""}
        </label>

        <Input
          type="text"
          placeholder={`Enter ${cred.title}`}
          onChange={(e) =>
            setMetadata((m) => ({
              ...m,
              [cred.title]: e.target.value,
            }))
          }
        />
      </div>
    ))}
  </div>
)}

      <SheetFooter>
        <Button
          onClick={() =>
            onSelect({
              type: selected, // machine ID like "lighter"
              metadata,
            })
          }
        >
          Create Action
        </Button>
      </SheetFooter>
    </SheetContent>
  );
}
