# Web3 Wallet Authentication Integration

## Overview

VeriVid now includes a complete Web3 wallet authentication system that integrates seamlessly into the existing interface without requiring separate authentication or profile pages.

## Features

### 1. **Wallet Connection**

- **Connect Wallet Button**: Located in the navbar, users can click to open the wallet selection modal
- **Supported Wallets**:
  - MetaMask 🦊
  - WalletConnect 🔗
  - Coinbase Wallet 💼
- **Auto-Registration**: User accounts are created automatically on first wallet connection
- **Session Persistence**: Wallet connection persists across browser sessions using localStorage

### 2. **User Interface States**

#### Disconnected State

- Navbar shows: "Connect Wallet" button with gradient styling
- Button opens WalletConnectModal when clicked

#### Connected State

- Navbar shows: Truncated wallet address (e.g., `0x742d...f44e`) in a glassmorphic button
- Connected indicator: Green pulsing dot next to address
- Clicking address opens ProfileSettingsDropdown

### 3. **Profile Management**

Users can customize their profile through the dropdown menu:

- **Username**: Display name for the platform
- **Email**: Used for recovery and notifications (optional)
- **Bio**: Personal description (optional)

All profile data is stored locally and persists across sessions.

### 4. **Email Recovery Flow**

Accessible from the profile dropdown:

1. User clicks "Recovery Options"
2. EmailRecoveryModal appears
3. User enters their registered email
4. System simulates sending recovery link
5. Success confirmation with "Return Home" option

## Technical Implementation

### Context Provider

```tsx
// contexts/WalletContext.tsx
- Manages wallet connection state
- Handles user profile data
- Provides authentication methods
- Persists data to localStorage
```

### Components

#### WalletConnectModal

- 3-step process: Select → Signing → Success
- Animated transitions between states
- Simulates wallet signature request

#### ProfileSettingsDropdown

- Inline profile editing
- Copy wallet address functionality
- Access to recovery options
- Disconnect wallet option

#### EmailRecoveryModal

- Email input with validation
- Animated send process
- Success confirmation

### Integration Points

1. **App.tsx**: Wrapped in `WalletProvider`
2. **Navbar.tsx**: Displays wallet status and connection controls
3. **UploadPage.tsx**: Uses wallet address for video ownership
4. **CertificatePage.tsx**: Shows connected wallet as certificate owner

## User Flow

### First-Time User

1. Lands on VeriVid homepage
2. Clicks "Connect Wallet" in navbar
3. Selects preferred wallet from modal
4. Signs message in wallet
5. Automatically registered with wallet address
6. Can optionally add username/email/bio

### Returning User

1. Wallet connection automatically restored
2. Navbar shows connected wallet address
3. Can access profile settings via dropdown
4. Can disconnect or manage recovery options

### Video Verification Flow

1. User must be connected to verify videos
2. Wallet address is recorded as video owner
3. Certificate displays connected wallet as owner
4. Blockchain transactions tied to wallet address

## Data Storage

### localStorage Keys

- `verivid_wallet`: Stores connected wallet address
- `verivid_profile`: Stores user profile data (JSON)

### Profile Structure

```json
{
  "username": "User1234",
  "email": "user@example.com",
  "bio": "Content creator and blockchain enthusiast"
}
```

## Security Notes

- No private keys are stored
- All blockchain operations are simulated (mock implementation)
- Real implementation should use Web3 libraries (ethers.js, wagmi, etc.)
- JWT sessions should be implemented server-side
- Email recovery should use secure token generation

## Design Philosophy

- **In-Context**: All wallet interactions happen via modals/dropdowns
- **Non-Intrusive**: No separate auth or profile pages required
- **Visual Clarity**: Clear state changes between connected/disconnected
- **Brand Consistency**: Maintains VeriVid's glassmorphic aesthetic
- **Smooth Animations**: Loading states and transitions feel premium

## Future Enhancements

- Real Web3 wallet integration (MetaMask, WalletConnect SDK)
- ENS name resolution for addresses
- Multi-chain support (Ethereum, Polygon, etc.)
- NFT-based certificates
- Social login options (Google, Twitter) with wallet linking
- Transaction history and gas estimation
- Hardware wallet support (Ledger, Trezor)

## Code Examples

### Using Wallet Context

```tsx
import { useWallet } from "./contexts/WalletContext";

function MyComponent() {
  const { isConnected, walletAddress, connectWallet, disconnectWallet } =
    useWallet();

  return (
    <div>
      {isConnected ? (
        <p>Connected: {walletAddress}</p>
      ) : (
        <button onClick={() => connectWallet("0x...")}>Connect</button>
      )}
    </div>
  );
}
```

### Checking Connection Status

```tsx
const { isConnected } = useWallet();

if (!isConnected) {
  return <ConnectWalletPrompt />;
}
```

### Updating Profile

```tsx
const { updateProfile } = useWallet();

updateProfile({
  username: "NewUsername",
  email: "newemail@example.com",
});
```

## Testing

To test the wallet integration:

1. Click "Connect Wallet" in navbar
2. Select any wallet option
3. Wait for signing animation (2 seconds)
4. Observe success state and navbar update
5. Click wallet address to open dropdown
6. Try profile settings and recovery options
7. Refresh page to verify persistence
8. Disconnect and reconnect to test full flow
