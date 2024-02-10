"use client";
import { useState } from "react";
import { useCluster } from "./cluster-data-access";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Checked = DropdownMenuCheckboxItemProps["checked"];

export function ClusterUiSelect() {
  const [showStatusBar, setShowStatusBar] = useState<Checked>(false);
  const { clusters, setCluster, cluster } = useCluster();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{cluster.name}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {clusters.map((item) => (
          <DropdownMenuCheckboxItem
            key={item.name}
            checked={item.name === cluster.name ? true : false}
            onCheckedChange={setShowStatusBar}
            onClick={() => setCluster(item)}
          >
            {item.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
