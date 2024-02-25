"use client";
import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";

export default function JupiterSwap() {
  const [isJupiterLoaded, setJupiterLoaded] = useState(false);

  // Define the initializeJupiter function here so it's accessible in both useEffect and onLoad
  const initializeJupiter = () => {
    if (window.Jupiter) {
      window.Jupiter.init({
        displayMode: "integrated",
        integratedTargetId: "integrated-terminal",
        endpoint: "https://api.devnet.solana.com",
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
  }, [isJupiterLoaded]); // Dependency array to ensure the effect runs only when isJupiterLoaded changes

  return (
    <div>
      <Head>
        <title>Jupiter Swap</title>
        <meta name="description" content="Jupiter Swap" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
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
      </main>
    </div>
  );
}
