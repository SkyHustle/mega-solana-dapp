import { Connection, PublicKey } from "@solana/web3.js";
import { nativeToUi } from "@mrgnlabs/mrgn-common";
import {
  Balance,
  Bank,
  MarginRequirementType,
  MarginfiAccount,
  MarginfiClient,
  PriceBias,
  RiskTier,
  getConfig,
} from "@mrgnlabs/marginfi-client-v2";
// import { Infer, array, assert, object, string } from "superstruct";
import { useConnection } from "@solana/wallet-adapter-react";

export default function Pools() {
  return <div>Pools</div>;
}
