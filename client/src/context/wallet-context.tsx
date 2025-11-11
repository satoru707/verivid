import { useState, useEffect, useCallback } from 'react';
import { WalletContext } from './use-wallet';
import { walletService } from '../services/wallet.service';
import { apiService } from '../services/api.service';

interface UserProfile {
  id?: string;
  wallet?: string;
  username?: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({});

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        const res = await apiService.getCurrentUser();
        if (res.data) {
          setWalletAddress(res.data.wallet);
          setUserProfile(res.data);
          setIsConnected(true);
        }
      } catch {
        console.log('[Auth] No session');
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await walletService.connect();
      if (!response) throw new Error('No address');

      setWalletAddress(response.address);
      setIsConnected(true);
      // const userRes = await apiService.getCurrentUser();
      setUserProfile(response.user);

      return response.address;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection failed';
      setError(msg);
      console.error('[Auth] Connect error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    try {
      setIsLoading(true);
      await walletService.disconnect();
      setWalletAddress(null);
      setIsConnected(false);
      setUserProfile({});
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    try {
      setIsLoading(true);
      const res = await apiService.updateUserProfile(data);
      setUserProfile(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Update failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        isLoading,
        error,
        walletAddress,
        userProfile,
        connectWallet,
        disconnectWallet,
        updateProfile,
        clearError,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
