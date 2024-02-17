import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { useConnection } from "@solana/wallet-adapter-react";
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";

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
