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
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { Button } from "./ui/button";
import type { PriceNodeMetaData } from "./nodes/triggers/PriceTrigger";
import type { TimerNodeMetaData } from "./nodes/triggers/Timer";

const SUPPORTED_TRIGGERS = [
  {
    id: "timer",
    title: "Timer",
    description: "RUN THIS TRIGGER EVERY X SECONDS/MINUTES",
  },
  {
    id: "price-trigger",
    title: "Price Trigger",
    description: "Runs when price goes above/below a value",
  },
];
export const SUPPORTED_ASSETS=["BTC","SOL"];

export function TriggerSheet({
  onSelect,
}: {
  onSelect: (data: { kind: NodeKind; metadata: any }) => void;
}) {
  const [metadata, setMetadata] = useState<PriceNodeMetaData | TimerNodeMetaData>({
    time:3600
  });
  const [selectedtrigger, setselecttrigger] = useState<string>(
    SUPPORTED_TRIGGERS[0].id
  );

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Select the Trigger</SheetTitle>
        <SheetDescription>Select the type of trigger you need.</SheetDescription>
      </SheetHeader>

      <Select
        value={selectedtrigger}
        onValueChange={(value) => setselecttrigger(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select trigger" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {SUPPORTED_TRIGGERS.map(({ id, title }) => (
              <SelectItem key={id} value={id}>
                {title}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {selectedtrigger === "timer" && <div>
        Number of seconds after which to run the timer
         <Input
        value={metadata.time}
        onChange={(e) => setMetadata(metadata=>({
          ...metadata,
          time:Number(e.target.value)
        }))}
      ></Input>
        </div>}
      {selectedtrigger ==="price-trigger" && <div>
        Price:
        <Input type="text" onChange={(e)=>setMetadata(m=>({
          ...m,
          price:Number(e.target.value)
        }))}></Input>
        Assest:
         <Select
        value={metadata.asset}
        onValueChange={(value) => setMetadata(metadata=>({
          ...metadata,
          asset:value
        }))}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select trigger" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {SUPPORTED_ASSETS.map((id)=><>
             <SelectItem key={id} value={id}>
                {id}
              </SelectItem>
            </>)}
          </SelectGroup>
        </SelectContent>
      </Select>
        </div>}

      <SheetFooter>
        <Button
          onClick={() =>
            onSelect({
              type: selectedtrigger as NodeKind,
              metadata,
            })
          }
        >
          Create Trigger
        </Button>
      </SheetFooter>
    </SheetContent>
  );
}
