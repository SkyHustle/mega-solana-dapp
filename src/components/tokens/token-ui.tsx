import { useGetTokenAccounts } from "./token-data-access";
import DataTable from "../ui/data-table";
import LoadingSpinner from "../ui/loading-spinner";
import { Button } from "../ui/button";
import { RefreshCw } from "lucide-react";
import { ExplorerLink } from "../cluster/cluster-ui";
import { ColumnDef } from "@tanstack/react-table";
import { PublicKey, AccountInfo, ParsedAccountData } from "@solana/web3.js";
import { ellipsify } from "@/lib/utils";

export function TokenAccounts({ address }: { address: PublicKey }) {
  const query = useGetTokenAccounts({ address });

  const tokenAccounts: { pubkey: PublicKey; account: AccountInfo<ParsedAccountData> }[] = query.data ?? [];

  return (
    <div>
      <div className="flex items-center justify-between py-3">
        <div className="min-w-0 flex-1">
          <h2 className="font-bold leading-7 sm:truncate sm:text-2xl sm:tracking-tight">Token Accounts</h2>
        </div>
        {query.isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <Button type="button" variant="outline" size="sm">
              <RefreshCw className="h-5 w-5 pr-1" onClick={() => query.refetch()} />
            </Button>
          </div>
        )}
        {query.isError && <pre className="">Error: {query.error?.message.toString()}</pre>}
      </div>
      {query.isSuccess && <DataTable columns={columns} data={tokenAccounts} />}
    </div>
  );
}

export const columns: ColumnDef<{ pubkey: PublicKey; account: AccountInfo<ParsedAccountData> }>[] = [
  {
    id: "pubkey", // Unique ID for the column
    accessorKey: "pubkey", // Accessor points to the pubkey data
    header: "Public Key",
    cell: ({ row }) => {
      const pubKey = row.getValue("pubkey") as PublicKey;
      return <ExplorerLink path={`account/${pubKey.toString()}`} label={ellipsify(pubKey.toString(), 4)} />;
    },
  },
  {
    id: "mint", // Unique ID for the column
    accessorFn: (row) => row.account, // Custom accessor function to get the account data
    header: "Mint",
    cell: ({ cell }) => {
      const accountInfo = cell.getValue() as AccountInfo<ParsedAccountData>; // Use cell.getValue() to get the value from the custom accessor
      const mint: string = accountInfo.data.parsed.info.mint;
      return <ExplorerLink path={`account/${mint}`} label={ellipsify(mint, 4)} />;
    },
  },
  {
    id: "balance", // Unique ID for the column
    accessorFn: (row) => row.account, // Reuse the custom accessor function
    header: "Balance",
    cell: ({ cell }) => {
      const accountInfo = cell.getValue() as AccountInfo<ParsedAccountData>; // Reuse the logic to extract the balance
      const tokenAmount: number = accountInfo.data.parsed.info.tokenAmount.uiAmount;
      return tokenAmount.toString();
    },
  },
];
