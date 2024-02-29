## Mega Solana Dapp Tinkering

For learning purposes, I wanted to build a clean front-end that interacts with the solana blockchain. 
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
This is built from scratch, loosely based on the [`create-solana-dapp`](https://github.com/solana-developers/create-solana-dapp) scaffold with a bunch of added features: 
- sexier ui using [shadcn/ui](https://ui.shadcn.com)
   - data tables with pagination
   - [sonner](https://sonner.emilkowal.ski) toasts
   - dialogs/modals
   - light/dark/system mode toggle
- responsive across different screen sizes
- token creation and minting
- live Chainlink price feeds
- token swap on mainnet using Jupiter Terminal

### Users are able to
- connect to the app with their crypto wallet using [solana wallet adapter](https://github.com/anza-xyz/wallet-adapter)
- create and mint basic [`spl-token`](https://spl.solana.com/token)
- create and mint token(s) with meta-data using Metaplex [`mpl-token-metadata`](https://github.com/metaplex-foundation/mpl-token-metadata)
- Connect to all available [Chainlink Price Feeds](https://docs.chain.link/data-feeds/solana/using-data-feeds-off-chain) and view real time price updates on devnet: SOL, BTC, ETH, LINK, USDC, USDT
- Swap tokens using [Jupiter Terminal V2](https://terminal.jup.ag) - *only works on mainnet, you need to provide your own rpc endpoint*
- change between different clusters: devnet, local, testnet, mainnet
- view their SOL account balance
- view their transaction history
- open transaction details in blockexplorer
- request an airdrop on devnet
- send SOL
- copy their address to clipboard to request SOL



## Getting Started

Clone this repo, `pnpm install` dependencies, run the development server `pnpm dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

