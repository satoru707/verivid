import { useState, useEffect } from 'react';
import { WalletContext } from './use-wallet';

interface UserProfile {
  username?: string;
  email?: string;
  bio?: string;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({});

  useEffect(() => {
    const savedAddress = localStorage.getItem('verivid_wallet');
    const savedProfile = localStorage.getItem('verivid_profile');

    if (savedAddress) {
      setWalletAddress(savedAddress);
      setIsConnected(true);
    }

    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
  }, []);

  const connectWallet = (address: string) => {
    setWalletAddress(address);
    setIsConnected(true);
    localStorage.setItem('verivid_wallet', address);

    const existingProfile = localStorage.getItem('verivid_profile');
    if (!existingProfile) {
      const initialProfile = { username: `User${address.slice(-4)}` };
      setUserProfile(initialProfile);
      localStorage.setItem('verivid_profile', JSON.stringify(initialProfile));
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setIsConnected(false);
    localStorage.removeItem('verivid_wallet');
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    const newProfile = { ...userProfile, ...profile };
    setUserProfile(newProfile);
    localStorage.setItem('verivid_profile', JSON.stringify(newProfile));
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        walletAddress,
        userProfile,
        connectWallet,
        disconnectWallet,
        updateProfile,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
