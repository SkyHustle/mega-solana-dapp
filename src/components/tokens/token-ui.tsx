import { useState } from "react";
import { useGetTokenAccounts } from "./token-data-access";
import DataTable from "../ui/data-table";
import LoadingSpinner from "../ui/loading-spinner";
import { Button } from "../ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";
import { ExplorerLink } from "../cluster/cluster-ui";
import { ColumnDef } from "@tanstack/react-table";
import { PublicKey, AccountInfo, ParsedAccountData } from "@solana/web3.js";
import { ellipsify } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCreateMint, useMintToken } from "./token-data-access";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";

export function TokenAccounts({ address }: { address: PublicKey }) {
  const query = useGetTokenAccounts({ address });
  const mutation = useCreateMint({ address });

  const tokenAccounts: { pubkey: PublicKey; account: AccountInfo<ParsedAccountData> }[] = query.data ?? [];

  function handleCreateToken() {
    mutation.mutateAsync();
  }

  return (
    <div>
      <div className="flex items-center justify-between py-3">
        <div className="min-w-0 flex-1">
          <h2 className="font-bold leading-7 sm:truncate sm:text-2xl sm:tracking-tight">Token Accounts</h2>
        </div>
        {query.isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="mt-4 flex md:ml-4 md:mt-0 gap-1">
            <Button type="button" variant="outline" size="sm" onClick={handleCreateToken}>
              Create Token
            </Button>
            <Button type="button" variant="outline" size="sm">
              <RefreshCw className="h-5 w-5" onClick={() => query.refetch()} />
            </Button>
          </div>
        )}
        {query.isError && <pre className="">Error: {query.error?.message.toString()}</pre>}
      </div>
      {query.isSuccess && <DataTable columns={columns} data={tokenAccounts} />}
    </div>
  );
}

const columns: ColumnDef<{ pubkey: PublicKey; account: AccountInfo<ParsedAccountData> }>[] = [
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
    id: "balance",
    accessorFn: (row) => row.account,
    header: "Balance",
    cell: ({ cell }) => {
      const accountInfo = cell.getValue() as AccountInfo<ParsedAccountData>; // Reuse the logic to extract the balance
      const tokenAmount: number = accountInfo.data.parsed.info.tokenAmount.uiAmount;
      return tokenAmount.toString();
    },
  },
  {
    id: "mintTokens",
    header: "Mint Tokens",
    cell: ({ row }) => {
      // Directly access the entire row data
      const rowData = row.original;
      const tokenAccountPublicKey: PublicKey = rowData.pubkey;
      const accountInfo = rowData.account as AccountInfo<ParsedAccountData>;
      const mintPublicKey: PublicKey = new PublicKey(accountInfo.data.parsed.info.mint);

      return <MintTokenModal tokenAccountPublicKey={tokenAccountPublicKey} mintPublicKey={mintPublicKey} />;
    },
  },
];

function MintTokenModal({
  tokenAccountPublicKey,
  mintPublicKey,
}: {
  tokenAccountPublicKey: PublicKey;
  mintPublicKey: PublicKey;
}) {
  const { publicKey } = useWallet();
  const mutation = useMintToken({
    address: publicKey!,
    mintPublicKey,
    tokenAccountPublicKey,
  });
  const [amount, setAmount] = useState("1");

  function handleSubmit() {
    mutation.mutateAsync({ amount: parseFloat(amount) }).then(() => {
      setAmount("1");
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mint Tokens</DialogTitle>
          <DialogDescription>Request Mint</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="amount" className="text-right">
            Amount
          </Label>
          <Input
            type="number"
            step="any"
            min="1"
            id="amount"
            placeholder="amount"
            className="col-span-3"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={handleSubmit}>
              Mint
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
