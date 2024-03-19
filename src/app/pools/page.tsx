"use client";
import { useState, useEffect } from "react";
import { BankSnapshot, UserAccountSnapshot } from "@/lib/marginfi-utils";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const dummyData = [
  {
    tokenSymbol: "BLZE",
    tokenName: "Blaze",
    bankAddress: "6Fk3bzhqmUqupk6sN5CbfYMdafvyzDdqDNHW5CsJzq8K",
    lendingRate: 0.08327364146415393,
    borrowingRate: 6.030457675365639,
    totalDepositsNative: "750883416689270166.023857919346652885004",
    totalBorrowsNative: "61287412279775759.415009829494114065708",
    totalDeposits: 750883416.6892701,
    totalBorrows: 61287412.27977576,
    totalDepositsUsdValue: 1053459.3982783784,
    totalBorrowsUsdValue: 86217.51345745844,
    riskTier: "Isolated",
  },
  {
    tokenSymbol: "RENDER",
    tokenName: "Render Token",
    bankAddress: "EbuSnXdFz1R4VPdaJ96KQQQmeYgZTHSzpNW94Tw1PE3H",
    lendingRate: 0.000937377902475624,
    borrowingRate: 5.109328587199132,
    totalDepositsNative: "48192699983673.9942611258980575466140103",
    totalBorrowsNative: "417333845744.40937463091464099266953396",
    totalDeposits: 481926.99983673997,
    totalBorrows: 4173.338457444093,
    totalDepositsUsdValue: 6396568.0086644655,
    totalBorrowsUsdValue: 55434.64764398824,
    riskTier: "Isolated",
  },
  {
    tokenSymbol: "bSOL",
    tokenName: "BlazeStake Staked SOL (bSOL)",
    bankAddress: "6hS9i46WyTq1KXcoa2Chas2Txh9TJAVr6n1t3tnrE23K",
    lendingRate: 0.1198062286516877,
    borrowingRate: 6.235993192980865,
    totalDepositsNative: "399852357470989.592665824171088383042756",
    totalBorrowsNative: "39145726101501.692711625808038021932922",
    totalDeposits: 399852.3574709896,
    totalBorrows: 39145.72610150169,
    totalDepositsUsdValue: 85708961.3991947,
    totalBorrowsUsdValue: 8444764.248287894,
    riskTier: "Collateral",
  },
  {
    tokenSymbol: "wstETH",
    tokenName: "Lido Wrapped Staked ETH",
    bankAddress: "9g3Tug2WbDwekghbPn2u3V84tvikAMBZiFbPUfkjwKNH",
    lendingRate: 0.00019778373537858242,
    borrowingRate: 5.0502194171188135,
    totalDepositsNative: "14687404821.249592800688361259411122277",
    totalBorrowsNative: "58423200.7215955360561915367680491265136",
    totalDeposits: 146.87404821249592,
    totalBorrows: 0.5842320072159554,
    totalDepositsUsdValue: 612254.3839720436,
    totalBorrowsUsdValue: 2439.794028119078,
    riskTier: "Isolated",
  },
  {
    tokenSymbol: "WBTC",
    tokenName: "Wrapped BTC (Portal)",
    bankAddress: "BKsfDJCMbYep6gr9pq8PsmJbb5XGLHbAJzUV8vmorz7a",
    lendingRate: 0.022364559305303146,
    borrowingRate: 5.53401880757313,
    totalDepositsNative: "22338784818.2947575659511895820283258828",
    totalBorrowsNative: "944897523.271028461197760548892801446854",
    totalDeposits: 223.38784818294758,
    totalBorrows: 9.448975232710284,
    totalDepositsUsdValue: 15142321.609969193,
    totalBorrowsUsdValue: 651047.8057256909,
    riskTier: "Collateral",
  },
];

const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@yahoo.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@gmail.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@gmail.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@gmail.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
  },
];

type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

// interface Data {
//   banksShaped: BankSnapshot[];
//   userAccountsShaped: UserAccountSnapshot[];
// }

const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function DataTableDemo() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

// function Pools() {
//   // const [data, setData] = useState<Data | null>(dummyData);
//   const [data, setData] = useState(dummyData);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<Error | null>(null);

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     setIsLoading(true);
//   //     try {
//   //       const response = await fetch("/api/pools");
//   //       const data = await response.json();
//   //       if (response.ok) {
//   //         setData(data);
//   //       } else {
//   //         setError(new Error(data.error));
//   //       }
//   //     } catch (error) {
//   //       if (error instanceof Error) {
//   //         setError(error);
//   //       } else {
//   //         setError(new Error("An unknown error occurred"));
//   //       }
//   //     } finally {
//   //       setIsLoading(false);
//   //     }
//   //   };

//   //   fetchData();
//   // }, []);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   if (!data) {
//     return <div>No data available</div>;
//   }

//   // const { banksShaped, userAccountsShaped } = data;

//   return (
//     <div>
//       <h2>Banks</h2>
//       {data.map((bank, index) => (
//         <div key={index}>
//           <pre>{JSON.stringify(bank, null, 2)}</pre>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default Pools;
