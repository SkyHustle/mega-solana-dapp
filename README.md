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
- Swap tokens using [Jupiter Terminal V2](https://terminal.jup.ag) - ${{\color{Orangered}{\textsf{  Only works on mainnet, you need to provide your own rpc endpoint\ \}}}}\$
- change between different clusters: devnet, local, testnet, mainnet
- view their SOL account balance
- view their transaction history
- open transaction details in blockexplorer
- request an airdrop on devnet
- send SOL
- copy their address to clipboard to request SOL



### Getting Started

Clone this repo, `pnpm install` dependencies, run the development server `pnpm dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

### App Images

<img width="414" alt="mega-solana-dapp-1" src="https://github.com/SkyHustle/mega-solana-dapp/assets/9903275/0f885b11-ed54-4d65-9061-10b1843b734b"><img width="414" alt="mega-solana-dapp-2" src="https://github.com/SkyHustle/mega-solana-dapp/assets/9903275/a5d680e8-9799-484b-837b-28885ccd8b8b"><img width="414" alt="mega-solana-dapp-3" src="https://github.com/SkyHustle/mega-solana-dapp/assets/9903275/ebcbbc65-3531-4bf1-b9a8-20f9ebd1206e"><img width="414" alt="mega-solana-dapp-4" src="https://github.com/SkyHustle/mega-solana-dapp/assets/9903275/41817a1b-ae71-4fa5-a3d7-225f379d24f8"><img width="414" alt="mega-solana-dapp-5" src="https://github.com/SkyHustle/mega-solana-dapp/assets/9903275/98ffba01-beb3-4e4d-b80c-cf5f04529ba4"><img width="414" alt="mega-solana-dapp-6" src="https://github.com/SkyHustle/mega-solana-dapp/assets/9903275/d973d83c-cfec-4b49-ba6c-0b59749a3b5b">


