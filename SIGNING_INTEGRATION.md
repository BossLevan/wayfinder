# Wallet Signing Integration

This document explains how wallet signing has been integrated into your existing app modals.

## Overview

All action modals now use **real wallet signing** instead of simulated delays. When users click "Sign & Activate" in any modal, they'll be prompted to sign a message with their wallet.

## Updated Components

### 1. **Custom Hook: `use-sign-action.ts`**

A reusable hook that handles wallet signing for any action:

```typescript
const { signAction, isProcessing, error } = useSignAction();

await signAction({
  action: "Configure Burns",
  details: {
    burnAmount: "1000",
    frequency: "weekly",
    percentage: 5,
  },
});
```

### 2. **Updated Modals**

All modals now use real wallet signing:

- ✅ **Burns Modal** - Sign burn configuration
- ✅ **Airdrop Modal** - Sign airdrop setup
- ✅ **Buyback Modal** - Sign buyback configuration
- ✅ **Revenue Sharing Modal** - Sign revenue sharing setup

## How It Works

### User Flow

1. **User configures action** in modal (e.g., set burn amount, frequency)
2. **User clicks "Sign & Activate"**
3. **Wallet prompt appears** asking to sign a message
4. **User signs** the message in their wallet
5. **Action completes** and modal closes
6. **UI updates** with the new configuration

### What Gets Signed

When a user signs, they're signing a JSON message containing:

```json
{
  "action": "Configure Burns",
  "details": {
    "burnAmount": "1000",
    "frequency": "weekly",
    "percentage": 5
  },
  "timestamp": 1698765432000
}
```

This creates an **audit trail** of actions users have agreed to.

## Error Handling

The integration handles several error cases:

### 1. Wallet Not Connected
```typescript
if (!isConnected) {
  alert("Please connect your wallet first");
  return;
}
```

### 2. User Rejects Signature
If the user clicks "Reject" in their wallet:
- The modal stays open
- No changes are made
- Error is logged but not shown (user intentionally rejected)

### 3. Wallet Error
If there's a technical error:
- Error is captured in the `signError` state
- Can be displayed in the UI if needed

## Button States

The "Sign & Activate" button has different states:

- **Idle**: "Sign & Activate"
- **Processing**: "Signing..." with spinner
- **Disabled**: When wallet not connected or form invalid

## Using in New Modals

To add signing to a new modal:

```typescript
import { useSignAction } from "./use-sign-action";
import { useAccount } from "wagmi";

export function MyModal() {
  const { isConnected } = useAccount();
  const { signAction, isProcessing } = useSignAction();

  const handleSignAndActivate = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      await signAction({
        action: "My Action",
        details: {
          // your action details
        },
      });

      // Action succeeded
      onComplete();
    } catch (err) {
      console.error("Failed to sign:", err);
    }
  };

  return (
    <button 
      onClick={handleSignAndActivate}
      disabled={isProcessing}
    >
      {isProcessing ? "Signing..." : "Sign & Activate"}
    </button>
  );
}
```

## Testing

1. **Start your dev server**: `npm run dev`
2. **Navigate to your app**: http://localhost:3000
3. **Connect your wallet** using the button in the header
4. **Open any modal** (Burns, Airdrop, Buyback, Revenue Sharing)
5. **Configure the action**
6. **Click "Sign & Activate"**
7. **Approve the signature** in your wallet
8. **Verify the action completes**

## Production Considerations

### Security

- The messages are signed **client-side only**
- No private keys are ever sent to servers
- Signatures provide proof of user consent

### Backend Integration

When you add a backend, you can:

1. Send the signature + message to your API
2. Verify the signature server-side using the wallet address
3. Process the action only if signature is valid
4. Store signatures for audit logs

Example server-side verification:

```typescript
import { verifyMessage } from "viem";

const isValid = await verifyMessage({
  address: userAddress,
  message: signedMessage,
  signature: signature,
});

if (isValid) {
  // Process the action
}
```

### Upgrading to Transactions

If you want to send actual blockchain transactions instead of just signing messages, replace `useSignMessage` with `useWriteContract` or `useSendTransaction`:

```typescript
// Instead of signing a message
const { signMessageAsync } = useSignMessage();

// Use a contract write
const { writeContractAsync } = useWriteContract();

await writeContractAsync({
  address: contractAddress,
  abi: contractAbi,
  functionName: "configureBurn",
  args: [burnAmount, frequency],
});
```

## Benefits

✅ **Real wallet integration** - Users actually sign with their wallets
✅ **User consent** - Cryptographic proof of user actions
✅ **Audit trail** - All actions are verifiable on-chain
✅ **Security** - No centralized approval needed
✅ **Trust** - Users maintain full control

## Next Steps

1. Connect wallet and test all modals
2. Consider adding backend verification
3. Optionally upgrade to on-chain transactions
4. Add signature storage for audit logs
5. Implement signature verification in your backend

For more examples, check out `/demo-wallet` in your app!

