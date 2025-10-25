# Wallet Connection Setup Guide

This guide explains how to use the RainbowKit wallet connection integration in Wayfinder.

## 🚀 Quick Start

Visit `/demo-wallet` in your app to try out all wallet features:
- Send ETH transactions
- Interact with smart contracts (ERC20 tokens)
- Sign messages

## Setup Instructions

### 1. Get a WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Sign in or create an account
3. Create a new project
4. Copy your Project ID

### 2. Configure Environment Variables

Create a `.env.local` file in the root of your project:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

Replace `your_project_id_here` with your actual WalletConnect Project ID.

## Supported Chains

The app is configured to support the following networks:
- Ethereum Mainnet
- Base
- Zora
- Zora Sepolia (testnet)

## Using the Wallet Connection

### Basic Connect Button

The simplest way to add wallet connection is using the default button:

```tsx
import { WalletConnectButton } from "@/app/_components/wallet-connect-button";

export default function MyPage() {
  return <WalletConnectButton />;
}
```

### Accessing Wallet Data

Use wagmi hooks to interact with the connected wallet:

```tsx
"use client";

import { useAccount, useBalance } from "wagmi";

export function WalletInfo() {
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({ address });

  if (!isConnected) {
    return <p>Please connect your wallet</p>;
  }

  return (
    <div>
      <p>Address: {address}</p>
      <p>Chain: {chain?.name}</p>
      <p>Balance: {balance?.formatted} {balance?.symbol}</p>
    </div>
  );
}
```

### Signing Messages

Check out the `SignMessageExample` component for a complete example:

```tsx
import { SignMessageExample } from "@/app/_components/sign-message-example";

export default function SignPage() {
  return <SignMessageExample />;
}
```

### Sending Transactions

Here's an example of sending a transaction:

```tsx
"use client";

import { useSendTransaction, useAccount } from "wagmi";
import { parseEther } from "viem";

export function SendTransaction() {
  const { address } = useAccount();
  const { sendTransaction, data: hash, isPending } = useSendTransaction();

  const handleSend = () => {
    sendTransaction({
      to: "0x...", // recipient address
      value: parseEther("0.01"), // amount in ETH
    });
  };

  return (
    <button onClick={handleSend} disabled={isPending}>
      {isPending ? "Sending..." : "Send 0.01 ETH"}
    </button>
  );
}
```

### Writing to Smart Contracts

Example of interacting with a smart contract:

```tsx
"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseAbi } from "viem";

const abi = parseAbi([
  'function mint(address to, uint256 amount) public',
]);

export function MintToken() {
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleMint = () => {
    writeContract({
      address: "0x...", // contract address
      abi,
      functionName: "mint",
      args: ["0x...", BigInt(100)],
    });
  };

  return (
    <div>
      <button onClick={handleMint} disabled={isLoading}>
        {isLoading ? "Minting..." : "Mint Tokens"}
      </button>
      {isSuccess && <p>Transaction successful!</p>}
    </div>
  );
}
```

## Useful Hooks

- `useAccount()` - Get connected wallet info
- `useBalance()` - Get wallet balance
- `useSignMessage()` - Sign messages
- `useSendTransaction()` - Send ETH
- `useWriteContract()` - Call contract functions
- `useReadContract()` - Read from contracts
- `useWaitForTransactionReceipt()` - Wait for transaction confirmation
- `useChainId()` - Get current chain ID
- `useSwitchChain()` - Switch networks

## Resources

- [RainbowKit Documentation](https://www.rainbowkit.com/docs/introduction)
- [Wagmi Documentation](https://wagmi.sh)
- [Viem Documentation](https://viem.sh)

## Troubleshooting

### "Invalid Project ID" Error

Make sure you've:
1. Created a project on WalletConnect Cloud
2. Added the Project ID to `.env.local`
3. Restarted your dev server after adding the env variable

### Wallet Not Connecting

- Check that you're on a supported network
- Try clearing your browser cache
- Make sure your wallet extension is up to date

### TypeScript Errors

All wagmi hooks must be used in client components. Add `"use client"` at the top of your file if you're getting errors.

