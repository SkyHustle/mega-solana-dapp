import { PublicKey } from "@solana/web3.js";
import { useState } from "react";
import { useGetBalance } from "./account-data-access";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Check, Copy, HandCoins } from "lucide-react";
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
import { Button } from "@/components/ui/button";

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

export function ReceiveModal({ address }: { address: PublicKey }) {
  const [isCopied, setIsCopied] = useState(false);

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      console.log(`Copied ${text} to clipboard`);
      // wait 2 seconds and then reset the button
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
      // alert("Copied to clipboard"); // Optionally, show some feedback
      // Toast this shit!
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <HandCoins className="h-5 w-5 pr-1" />
          Receive
        </Button>
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
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" onClick={() => copyToClipboard(address.toString())} />
            )}
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
