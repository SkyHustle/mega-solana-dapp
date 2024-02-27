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
        endpoint: "https://necessary-damp-gadget.solana-mainnet.quiknode.pro/fc5b7b4702382c892c962f9f7b2278eceef3cb5f/",
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
    <div className="flex justify-center items-center sm:mt-24">
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
      <div className="bg-black sm:w-1/2 rounded-md" id="integrated-terminal">
        {/* Jupiter Terminal should be initialized here */}
      </div>
    </div>
  );
}
