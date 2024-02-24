"use client";
import React, { useState, useEffect } from "react";
import { OCR2Feed } from "@chainlink/solana-sdk";
import { PublicKey } from "@solana/web3.js";
import { AnchorProvider } from "@project-serum/anchor";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const feeds = [
  {
    iconURL: "/solana.svg",
    symbol: "SOL",
    name: "Solana",
    price: "$110.00",
    feedAddress: "99B2bTijsU6f1GCT73HmdR7HCFFjGMBcPZY6jZ96ynrR",
  },
  {
    iconURL: "/bitcoin.svg",
    symbol: "BTC",
    name: "Bitcoin",
    price: "$50,000",
    feedAddress: "6PxBx93S8x3tno1TsFZwT5VqP8drrRCbCXygEXYNkFJe",
  },
  {
    iconURL: "/ethereum.svg",
    symbol: "ETH",
    name: "Ethereum",
    price: "$3,000",
    feedAddress: "669U43LNHx7LsVj95uYksnhXUfWKDsdzVqev3V4Jpw3P",
  },
  {
    iconURL: "/chainlink.svg",
    symbol: "LINK",
    name: "Chainlink",
    price: "$20",
    feedAddress: "HXoZZBWv25N4fm2vfSKnHXTeDJ31qaAcWZe3ZKeM6dQv",
  },
  {
    iconURL: "/usdc.svg",
    symbol: "USDC",
    name: "USDC",
    price: "$1",
    feedAddress: "2EmfL3MqL3YHABudGNmajjCpR13NNEn9Y4LWxbDm6SwR",
  },
  {
    iconURL: "/tether.svg",
    symbol: "USDT",
    name: "Tether",
    price: "$1",
    feedAddress: "8QQSUPtdRTboa4bKyMftVNRfGFsB4Vp9d7r39hGKi53e",
  },
];

// Note that the Wallet object provided by the useWallet hook from @solana/wallet-adapter-react
// is not compatible with the Wallet object that the Anchor Provider expects
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";

const ChainlinkPriceFeed = () => {
  const [price, setPrice] = useState<number>();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  useEffect(() => {
    if (!wallet) {
      console.log("Wallet not connected");
      return;
    } else {
      console.log("Wallet connected");
    }

    const CHAINLINK_FEED_ADDRESS = "99B2bTijsU6f1GCT73HmdR7HCFFjGMBcPZY6jZ96ynrR";
    const CHAINLINK_PROGRAM_ID = new PublicKey("cjg3oHmg9uuPsP8D6g29NWvhySJkdYdAo9D25PRbKXJ");
    const feedAddress = new PublicKey(CHAINLINK_FEED_ADDRESS);

    let dataFeed: OCR2Feed | undefined;
    let listener: number | undefined;

    const subscribeToPriceFeed = async () => {
      try {
        // Creating an AnchorProvider
        const provider = new AnchorProvider(connection, wallet, {});

        dataFeed = await OCR2Feed.load(CHAINLINK_PROGRAM_ID, provider);

        listener = dataFeed.onRound(feedAddress, (event) => {
          const rawPrice = event.answer.toNumber();
          const decimals = 8;
          const priceInDollars = rawPrice / Math.pow(10, decimals);
          const formattedPrice = parseFloat(priceInDollars.toFixed(2));
          setPrice(formattedPrice);
        });
      } catch (error) {
        console.error("Failed to subscribe to Chainlink Price Feed:", error);
      }
    };

    subscribeToPriceFeed();

    return () => {
      if (listener && dataFeed) {
        dataFeed.removeListener(listener);
      }
    };
  }, [wallet, connection]);

  return (
    <Table className="mt-16">
      <TableCaption>A List of Chainlink Price Feeds</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Icon</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {feeds.map((feed) => (
          <TableRow key={feed.name}>
            <TableCell className="font-medium">{feed.iconURL}</TableCell>
            <TableCell>{feed.symbol}</TableCell>
            <TableCell>{feed.name}</TableCell>
            <TableCell className="text-right">{feed.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ChainlinkPriceFeed;
