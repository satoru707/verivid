import type React from 'react';

/**
 * Wallet Context Provider - Manages authentication state and user profile
 * Uses context only for state management, no localStorage
 */
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
    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        // Check if JWT cookie exists by attempting to fetch current user
        const response = await apiService.getCurrentUser();
        if (response.user) {
          setWalletAddress(response.user.wallet || null);
          setUserProfile(response.user);
          setIsConnected(true);
        }
      } catch (err) {
        // JWT invalid or expired, user is not connected
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const address = await walletService.connect();
      setWalletAddress(address);
      setIsConnected(true);

      try {
        const response = await apiService.getCurrentUser();
        if (response.user) {
          setUserProfile(response.user);
        }
      } catch (err) {
        // Profile fetch failed but auth succeeded, set basic profile
        setUserProfile({ wallet: address });
      }

      return address;
    } catch (err: any) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMsg);
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
    } catch (err) {
      console.error('[Auth] Disconnect error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiService.updateUserProfile(data);
      if (response.user) {
        setUserProfile(response.user);
      }
    } catch (err: any) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

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
