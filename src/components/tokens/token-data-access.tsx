import { PublicKey, TransactionSignature, Transaction } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ellipsify } from "@/lib/utils";
import { useCluster } from "@/components/cluster/cluster-data-access";
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID, createMintToCheckedInstruction } from "@solana/spl-token";

export function useGetTokenAccounts({ address }: { address: PublicKey }) {
  const { connection } = useConnection();

  return useQuery({
    queryKey: ["get-token-accounts", { endpoint: connection.rpcEndpoint, address }],
    queryFn: async () => {
      const [tokenAccounts, token2022Accounts] = await Promise.all([
        connection.getParsedTokenAccountsByOwner(address, {
          programId: TOKEN_PROGRAM_ID,
        }),
        connection.getParsedTokenAccountsByOwner(address, {
          programId: TOKEN_2022_PROGRAM_ID,
        }),
      ]);
      return [...tokenAccounts.value, ...token2022Accounts.value];
    },
  });
}

export function useMintToken({
  address,
  mintPublicKey,
  tokenAccountPublicKey,
}: {
  address: PublicKey;
  mintPublicKey: PublicKey;
  tokenAccountPublicKey: PublicKey;
}) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const client = useQueryClient();
  const { getExplorerUrl } = useCluster();

  return useMutation({
    mutationKey: ["mint-token", { endpoint: connection.rpcEndpoint, address }],
    mutationFn: async (input: { amount: number }) => {
      let signature: TransactionSignature = "";
      try {
        const transaction = new Transaction().add(
          createMintToCheckedInstruction(
            mintPublicKey, // mint
            tokenAccountPublicKey, // receiver (should be a token account)
            address, // mint authority
            input.amount, // amount of tokens to mint
            0 // decimals
          )
        );

        // Send transaction and await for signature
        signature = await wallet.sendTransaction(transaction, connection);

        console.log(signature);
        return signature;
      } catch (error: unknown) {
        console.log("error", `Transaction failed! ${error}`, signature);

        return;
      }
    },
    onSuccess: (signature) => {
      if (signature) {
        toast.success("Transaction Successfull", {
          description: ellipsify(signature),
          action: {
            label: "Explorer Link",
            onClick: () => window.open(getExplorerUrl(`tx/${signature}`), "_blank"),
          },
          duration: 10000,
        });
      }

      return Promise.all([
        client.invalidateQueries({
          queryKey: [
            "get-token-account-balance",
            {
              endpoint: connection.rpcEndpoint,
              account: tokenAccountPublicKey.toString(),
            },
          ],
        }),
      ]);
    },
    onError: (error) => {
      toast.error("Transaction Failed", {
        description: `${error}`,
        duration: 10000,
      });
      console.log("error", `Transaction failed! ${error}`);
    },
  });
}
