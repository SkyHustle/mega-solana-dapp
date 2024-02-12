"use client";

import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useGetBalance } from "./account-data-access";
import { Button } from "../ui/button";
import { Droplet, Send, HandCoins } from "lucide-react";
import { ExplorerLink } from "../cluster/cluster-ui";
import { ellipsify } from "@/components/ui/ui-layout";

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
            <Button variant="outline" size="sm">
              <HandCoins className="h-5 w-5 pr-1" />
              Receive
            </Button>
            <ReceiveModal address={address} />
          </div>
        </div>
      </div>
    </div>
  );
}

import { Copy } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ReceiveModal({ address }: { address: PublicKey }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Share</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Address</DialogTitle>
          <DialogDescription>Share your address to request funds</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue={address.toString()} readOnly />
          </div>
          <Button type="submit" size="sm" className="px-3">
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AccountBalance({ address }: { address: PublicKey }) {
  const query = useGetBalance({ address });

  return (
    <div>
      <h1
        className="text-1xl font-bold tracking-tight text-primary sm:text-2xl cursor-pointer"
        onClick={() => query.refetch()}
      >
        {query.data ? Math.round((query.data / LAMPORTS_PER_SOL) * 100000) / 100000 : "..."} SOL
      </h1>
    </div>
  );
}
