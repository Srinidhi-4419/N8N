import type { NodeKind } from "./CreateWorkflow";
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
import { useState } from "react";
import { Button } from "./ui/button";
import { SUPPORTED_ASSETS } from "./TriggerSheet";

const SUPPORTED_ACTIONS = [
  {
    id: "hyperliquid",
    title: "Hyperliquid",
    description: "Place a trade on hyperliquid",
  },
  {
    id: "lighter",
    title: "Lighter",
    description: "Place a trade on lighter",
  },
  {
    id: "backpack",
    title: "Backpack",
    description: "Place a trade on Backpack",
  },
];
export function ActionSheet({
  onSelect,
}: {
  onSelect: (data: { type: NodeKind; metadata: any }) => void;
}) {
  const [metadata, setMetadata] = useState<TradingMetadata | {}>({});
  const [selectedaction, setselectedaction] = useState<string>(
    SUPPORTED_ACTIONS[0].id
  );

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Select the action  </SheetTitle>
        <SheetDescription>Select the type of action you need.</SheetDescription>
      </SheetHeader>

      <Select
        value={selectedaction}
        onValueChange={(value) => setselectedaction(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select action" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {SUPPORTED_ACTIONS.map(({ id, title }) => (
              <SelectItem key={id} value={id}>
                {title}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {(selectedaction === "hyperliquid" || selectedaction === "lighter" || selectedaction === "backpack" ) && <div>
        <div className="pt-4">
            Type
        </div>
          <Select
        value={metadata?.type}
        onValueChange={(value) => setMetadata(metadata=>({
          ...metadata,
          type:value
        }))}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select action" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
           <SelectItem value={"long"}>LONG</SelectItem>
           <SelectItem value={"short"}>SHORT</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
        <div className="pt-4">
            Symbol
        </div>
        <Select
        value={metadata?.symbol}
        onValueChange={(value) => setMetadata(metadata=>({
          ...metadata,
          symbol:value
        }))}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select action" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
           {SUPPORTED_ASSETS.map(asset=><SelectItem key={asset} value={asset}>
            {asset}
           </SelectItem>)}
          </SelectGroup>
        </SelectContent>
      </Select>
        <div className="pt-4">
            Quantity
        </div>
         <Input type="text" onChange={(e)=>setMetadata(m=>({
          ...m,
          qty:Number(e.target.value)
        }))}></Input>
        </div>}

      <SheetFooter>
        <Button type="submit"
          onClick={() =>
            onSelect({
              type:selectedaction as NodeKind,
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
