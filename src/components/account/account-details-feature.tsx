"use client";

import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Button } from "../ui/button";
import { Droplet, Send, HandCoins } from "lucide-react";
import { ExplorerLink } from "../cluster/cluster-ui";
import { ellipsify } from "@/components/ui/ui-layout";
import { AccountBalance, ReceiveModal } from "./account-ui";

export default function AccountDetailFeature() {
  const params = useParams();

  const address = useMemo(() => {
    if (!params.address) {
      return;
    }
    try {
      return new PublicKey(params.address);
    } catch (e) {
      console.log(`Invalid public key`, e);
    }
  }, [params]);
  if (!address) {
    return <div>Error loading account</div>;
  }

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-5 sm:py-8 lg:py-9">
        <div className="text-center">
          <AccountBalance address={address} />
          <p className="mt-2 leading-8 text-gray-500">
            <ExplorerLink path={`account/${address}`} label={ellipsify(address.toString())} />
          </p>
          <div className="mt-4 flex items-center justify-center gap-x-6">
            <Button variant="outline" size="sm">
              <Droplet className="h-5 w-5 pr-1" />
              Airdrop
            </Button>

            <Button variant="outline" size="sm">
              <Send className="h-5 w-5 pr-1" />
              Send
            </Button>

            <ReceiveModal address={address} />
          </div>
        </div>
      </div>
    </div>
  );
}
