import { useState, useEffect } from "react";
import { useGetTokenAccounts } from "./token-data-access";
import DataTable from "../ui/data-table";
import LoadingSpinner from "../ui/loading-spinner";
import { Button } from "../ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";
import { ExplorerLink } from "../cluster/cluster-ui";
import { ColumnDef } from "@tanstack/react-table";
import { PublicKey, AccountInfo, ParsedAccountData, Connection } from "@solana/web3.js";
import { ellipsify } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
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
import { MintLayout } from "@solana/spl-token";

type EnhancedAccount = {
  pubkey: PublicKey;
  account: AccountInfo<ParsedAccountData>;
  isMintAuthority: boolean;
};

type TokenAccount = {
  pubkey: PublicKey;
  account: AccountInfo<ParsedAccountData>;
};

const enhanceAccountsWithMintAuthority = async (
  accounts: TokenAccount[],
  connection: Connection,
  userAddress: PublicKey
): Promise<EnhancedAccount[]> => {
  // Ensure the function returns Promise<EnhancedAccount[]>
  const enhancedAccounts = await Promise.all(
    accounts.map(async (account) => {
      const mintAddress = new PublicKey(account.account.data.parsed.info.mint);
      const mintAccountInfo = await connection.getAccountInfo(mintAddress);
      if (!mintAccountInfo) throw new Error("Failed to find mint account");

      const mintData = MintLayout.decode(mintAccountInfo.data);
      const isMintAuthority = mintData.mintAuthority && new PublicKey(mintData.mintAuthority).equals(userAddress);

      // Ensure the returned object matches the EnhancedAccount type
      return {
        pubkey: account.pubkey,
        account: account.account, // Cast to the expected type
        isMintAuthority,
      };
    })
  );

  return enhancedAccounts;
};

export function TokenAccounts({ address }: { address: PublicKey }) {
  const mutation = useCreateMint({ address });
  const { data: accounts, isSuccess, isError, error, isLoading, refetch } = useGetTokenAccounts({ address });
  const [enhancedAccounts, setEnhancedAccounts] = useState<EnhancedAccount[]>([]);
  const { connection } = useConnection();

  useEffect(() => {
    if (isSuccess && accounts) {
      enhanceAccountsWithMintAuthority(accounts, connection, address).then(setEnhancedAccounts);
    }
  }, [accounts, isSuccess, address, connection]);

  function handleCreateToken() {
    mutation.mutateAsync();
  }

  return (
    <div>
      <div className="flex items-center justify-between py-3">
        <div className="min-w-0 flex-1">
          <h2 className="font-bold leading-7 sm:truncate sm:text-2xl sm:tracking-tight">Token Accounts</h2>
        </div>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="mt-4 flex md:ml-4 md:mt-0 gap-1">
            <Button type="button" variant="outline" size="sm" onClick={handleCreateToken}>
              Create Token
            </Button>
            <Button type="button" variant="outline" size="sm">
              <RefreshCw className="h-5 w-5" onClick={() => refetch()} />
            </Button>
          </div>
        )}
        {isError && <pre className="">Error: {error?.message.toString()}</pre>}
      </div>
      {isSuccess && <DataTable columns={columns} data={enhancedAccounts} />}
    </div>
  );
}

const columns: ColumnDef<{ pubkey: PublicKey; account: AccountInfo<ParsedAccountData>; isMintAuthority: boolean }>[] = [
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
      const enhancedAccount = row.original;
      const tokenAccountPublicKey: PublicKey = enhancedAccount.pubkey;
      const accountInfo = enhancedAccount.account as AccountInfo<ParsedAccountData>;
      const mintPublicKey: PublicKey = new PublicKey(accountInfo.data.parsed.info.mint);

      if (enhancedAccount.isMintAuthority) {
        return <MintTokenModal tokenAccountPublicKey={tokenAccountPublicKey} mintPublicKey={mintPublicKey} />;
      } else {
        return <span className="text-gray-500">Not Authorized</span>;
      }
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
