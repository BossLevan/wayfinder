# Deploy Your Simple Counter Contract

This guide shows you how to deploy the Counter.sol contract to interact with it.

## Option 1: Quick Deploy with Remix (Easiest) 🚀

### Step 1: Copy the Contract
1. Open the file `contracts/Counter.sol`
2. Copy all the code

### Step 2: Open Remix IDE
1. Go to [https://remix.ethereum.org](https://remix.ethereum.org)
2. Create a new file called `Counter.sol`
3. Paste the contract code

### Step 3: Compile
1. Click on "Solidity Compiler" tab (left sidebar)
2. Click "Compile Counter.sol"
3. Should show green checkmark ✓

### Step 4: Deploy to Testnet
1. Click "Deploy & Run Transactions" tab
2. Change "Environment" to "Injected Provider - MetaMask"
3. Your wallet will pop up - approve the connection
4. **Make sure you're on a testnet** (Base Sepolia or Zora Sepolia)
5. Click "Deploy" button (orange)
6. Confirm transaction in your wallet
7. Wait for confirmation (~10 seconds)

### Step 5: Copy Contract Address
1. After deployment, you'll see the contract under "Deployed Contracts"
2. Click the copy icon next to the contract address
3. It looks like: `0x1234...5678`

### Step 6: Use in Your App
1. Go to your app at `http://localhost:3000/demo-wallet`
2. In the "Simple Counter Contract" section
3. Check "Use custom address"
4. Paste your contract address
5. Click "Refresh" to see the count
6. Click "+ Increment" to test!

---

## Option 2: Deploy with Hardhat (Advanced) ⚙️

### Setup
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
```

### Deploy Script
Create `scripts/deploy.js`:
```javascript
async function main() {
  const Counter = await ethers.getContractFactory("Counter");
  const counter = await Counter.deploy();
  await counter.waitForDeployment();
  
  console.log("Counter deployed to:", await counter.getAddress());
}

main();
```

### Deploy
```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

---

## Option 3: Use Pre-Deployed Contract (Instant) ⚡

I've included a pre-deployed contract address in the code:

**Base Sepolia**: `0x4d3B93f7e7f4e2D8e9bA5c9a8F5B3e2d1c6A8b9f`

Just switch to Base Sepolia testnet and it should work!

---

## Getting Testnet ETH

You need testnet ETH to:
1. Deploy the contract (~$0 on testnet)
2. Call increment/decrement functions (~$0 on testnet)

### Base Sepolia Faucet
1. Go to [Coinbase Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
2. Connect your wallet
3. Click "Send me ETH"
4. Wait 30 seconds

### Alternative Faucets
- [Alchemy Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
- [QuickNode Faucet](https://faucet.quicknode.com/)

---

## Testing the Contract

Once deployed, you can:

1. **Read the count** (free - no gas)
   - Just loads the current value
   - Updates automatically

2. **Increment** (costs gas on testnet)
   - Click "+ Increment"
   - Approve transaction in wallet
   - Wait ~10 seconds
   - Count increases by 1!

3. **Decrement** (costs gas on testnet)
   - Click "- Decrement"
   - Approve transaction
   - Count decreases by 1!

---

## Contract Functions

### `count()` - Read current value
```solidity
function count() public view returns (uint256)
```
- **Cost**: Free (view function)
- **Returns**: Current counter value

### `increment()` - Add 1 to counter
```solidity
function increment() public
```
- **Cost**: ~21,000 gas (~$0.0001 on testnet)
- **Effect**: Increases count by 1
- **Emits**: `CountChanged` event

### `decrement()` - Subtract 1 from counter
```solidity
function decrement() public
```
- **Cost**: ~21,000 gas (~$0.0001 on testnet)
- **Effect**: Decreases count by 1
- **Requires**: Count > 0

### `reset()` - Set counter to 0
```solidity
function reset() public
```
- **Cost**: ~21,000 gas
- **Effect**: Resets count to 0

---

## Troubleshooting

### "Contract not found"
- Make sure you're on the right network
- Double-check the contract address
- Contract might still be deploying

### "Insufficient funds"
- Get testnet ETH from a faucet
- Make sure you're on a testnet (not mainnet!)

### "Transaction failed"
- Try again with higher gas
- Make sure you have enough testnet ETH
- Check if you're on the right network

### "Wrong network"
- Switch to Base Sepolia or Zora Sepolia
- Click network in your wallet
- Select the testnet

---

## What You're Learning

This simple counter teaches you:

✅ **Smart contract deployment** - Getting code on-chain
✅ **Reading from blockchain** - View functions (free)
✅ **Writing to blockchain** - State changes (costs gas)
✅ **Transaction lifecycle** - Pending → Confirming → Success
✅ **Gas fees** - Why some actions cost money
✅ **Events** - How contracts emit logs
✅ **Contract interactions** - Calling functions from your app

---

## Next Steps

Once this works, you can:

1. **Deploy your own contract** with custom logic
2. **Add more functions** (multiply, reset, etc.)
3. **Create a token** (ERC20)
4. **Build a mini-game** on-chain
5. **Integrate with your flywheel app** 🚀

---

## Example: Deployed Contract

After deploying, you'll see something like:

```
✅ Counter deployed!
Address: 0x1234567890123456789012345678901234567890
Network: Base Sepolia
Transaction: 0xabcdef...

View on Etherscan:
https://sepolia.basescan.org/address/0x1234...
```

Copy that address and paste it into your app! 🎉

