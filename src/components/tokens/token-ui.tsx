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
  console.log("TokenAccounts", query.data);

  const tokenAccounts: { pubkey: PublicKey; account: AccountInfo<ParsedAccountData> }[] = query.data ?? [];

  console.log("TokenAccounts", tokenAccounts);
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
    accessorKey: "pubkey",
    header: "Public Key",
    cell: ({ row }) => {
      const pubKey = row.getValue("pubkey") as PublicKey;

      return <ExplorerLink path={`account/${pubKey.toString()}`} label={ellipsify(pubKey.toString(), 4)} />;
    },
  },
  {
    accessorKey: "account",
    header: "Mint",
    cell: ({ row }) => {
      // assert the type of the account to be AccountInfo<ParsedAccountData>
      const accountInfo = row.getValue("account") as AccountInfo<ParsedAccountData>;

      // Since AccountInfo's data property could be of several types, we need to ensure it's the type we expect
      // Assuming ParsedAccountData has a structure where 'parsed' and 'info' are defined
      if ("parsed" in accountInfo.data && "info" in accountInfo.data.parsed) {
        const mint: string = accountInfo.data.parsed.info.mint;
        return <ExplorerLink path={`account/${mint}`} label={ellipsify(mint, 4)} />;
      }

      // Return a fallback or error component if the data isn't in the expected shape
      return "Invalid data";
    },
  },
  {
    accessorKey: "account",
    header: "Balance",
    cell: ({ row }) => {
      // assert the type of the account to be AccountInfo<ParsedAccountData>
      const accountInfo = row.getValue("account") as AccountInfo<ParsedAccountData>;

      if (
        "parsed" in accountInfo.data &&
        "info" in accountInfo.data.parsed &&
        "tokenAmount" in accountInfo.data.parsed.info
      ) {
        const tokenAmount: number = accountInfo.data.parsed.info.tokenAmount.uiAmount;
        return tokenAmount.toString();
      }

      // Return a fallback or error component if the data isn't in the expected shape
      return "Invalid data";
    },
  },
];
