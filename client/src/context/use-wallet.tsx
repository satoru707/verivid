import { useContext, createContext } from 'react';

export interface UserProfile {
  id?: string;
  wallet?: string;
  username?: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
}

interface WalletContextType {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  walletAddress: string | null;
  userProfile: UserProfile;
  connectWallet: () => Promise<string | null>;
  disconnectWallet: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  clearError: () => void;
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
