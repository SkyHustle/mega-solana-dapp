"use client";
import React, { useState, useEffect } from "react";
import { OCR2Feed } from "@chainlink/solana-sdk";
import { PublicKey } from "@solana/web3.js";
import { AnchorProvider } from "@project-serum/anchor";

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

  return <div>{price ? `Live SOL Price: $${price}` : "Loading..."}</div>;
};

export default ChainlinkPriceFeed;
