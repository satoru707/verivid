import { useContext, createContext } from 'react';

interface UserProfile {
  username?: string;
  email?: string;
  bio?: string;
}

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  userProfile: UserProfile;
  connectWallet: (address: string) => void;
  disconnectWallet: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

export const WalletContext = createContext<WalletContextType | undefined>(
  undefined
);

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
