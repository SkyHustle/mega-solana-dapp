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
import { Trash2 } from "lucide-react";

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

export function ClusterUiTable() {
  const { clusters, setCluster, deleteCluster } = useCluster();

  return (
    <div className="overflow-x-auto">
      <table className="table border-4 border-separate border-base-300">
        <thead>
          <tr>
            <th>Name/ Network / Endpoint</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clusters.map((item) => (
            <tr key={item.name} className={item?.active ? "bg-base-200" : ""}>
              <td className="space-y-2">
                <div className="whitespace-nowrap space-x-2">
                  <span className="text-xl">
                    {item?.active ? (
                      item.name
                    ) : (
                      <button title="Select cluster" className="link link-secondary" onClick={() => setCluster(item)}>
                        {item.name}
                      </button>
                    )}
                  </span>
                </div>
                <span className="text-xs">Network: {item.network ?? "custom"}</span>
                <div className="whitespace-nowrap text-gray-500 text-xs">{item.endpoint}</div>
              </td>
              <td className="space-x-2 whitespace-nowrap text-center">
                <button
                  disabled={item?.active}
                  className="btn btn-xs btn-default btn-outline"
                  onClick={() => {
                    if (!window.confirm("Are you sure?")) return;
                    deleteCluster(item);
                  }}
                >
                  IconTrash
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TableDemo() {
  const { clusters, setCluster, deleteCluster } = useCluster();
  console.log("clusters", clusters);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Network</TableHead>
          <TableHead>Endpoint</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clusters.map((item) => (
          <TableRow key={item.name} className={item?.active ? "bg-secondary" : ""}>
            <TableCell className="font-medium">
              <span className="text-lg">
                {item?.active ? (
                  item.name
                ) : (
                  <button title="Select cluster" className="link link-secondary" onClick={() => setCluster(item)}>
                    {item.name}
                  </button>
                )}
              </span>
            </TableCell>
            <TableCell>{item.network ?? "custom"}</TableCell>
            <TableCell>{item.endpoint}</TableCell>
            <TableCell className="text-right">
              <Trash2 className="h-5 w-5 float-end" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
