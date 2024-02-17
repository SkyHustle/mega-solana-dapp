import { PublicKey } from "@solana/web3.js";
import { useGetTokenAccounts } from "./token-data-access";

export function TokenAccounts({ address }: { address: PublicKey }) {
  const query = useGetTokenAccounts({ address });
  console.log("TokenAccounts", query.data);

  return <div>TokenAccounts Ui</div>;
}
