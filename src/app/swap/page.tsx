"use client";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

export default function JupiterSwap() {
  const [isJupiterLoaded, setJupiterLoaded] = useState(false);

  const passthroughWalletContextState = useWallet();

  // Define the initializeJupiter function here so it's accessible in both useEffect and onLoad
  const initializeJupiter = () => {
    if (window.Jupiter) {
      window.Jupiter.init({
        displayMode: "integrated",
        integratedTargetId: "integrated-terminal",
        endpoint: "https://necessary-damp-gadget.solana-mainnet.quiknode.pro/",
        enableWalletPassthrough: true,
        formProps: {
          fixedOutputMint: false,
        },
      });
      setJupiterLoaded(true);
    }
  };

  useEffect(() => {
    // Call initializeJupiter if Jupiter hasn't been loaded yet
    if (!isJupiterLoaded) {
      initializeJupiter();
    }

    if (window.Jupiter && window.Jupiter.syncProps) {
      window.Jupiter.syncProps({ passthroughWalletContextState });
    }
  }, [isJupiterLoaded, passthroughWalletContextState]);

  return (
    <div>
      <Script
        src="https://terminal.jup.ag/main-v2.js"
        strategy="afterInteractive"
        onLoad={() => {
          // Call the initialize function once the script is loaded
          if (!isJupiterLoaded) {
            initializeJupiter();
          }
        }}
      />
      <h1>Jupiter Swap</h1>
      <div id="integrated-terminal">{/* Jupiter Terminal should be initialized here */}</div>
    </div>
  );
}
