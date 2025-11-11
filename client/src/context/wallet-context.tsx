import type React from 'react';

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

        const response = await apiService.getCurrentUser();
        if (response.data) {
          setWalletAddress(response.data.wallet || null);
          setUserProfile(response.data);
          setIsConnected(true);
        }
      } catch (err: unknown) {
        console.log(err);
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
      console.log('Starting wallet connection process...');
// 1. Connect wallet → raw address
const address = await walletService.connect();
console.log('Address from walletService.connect():', address);
if (!address) throw new Error('No address returned');

setWalletAddress(address);
setIsConnected(true);

// 2. Get nonce
console.log('Requesting nonce for address:', address);
const nonceRes = await apiService.getNonce(address);
const nonce = nonceRes.data.nonce;
console.log('Received nonce:', nonce);
// 3. Sign the message
const message = `VeriVid Authentication\n\nNonce: ${nonce}`;
console.log('Signing message:', message);
const signature = await walletService.signMessage(message);
console.log('Generated signature:', signature);
// 4. Login with "address:signature"
const loginRes = await apiService.login(`${address}:${signature}`);
console.log('Login response:', loginRes);
if (loginRes.error) throw new Error(loginRes.error);

      // 5. Load full profile
      const userRes = await apiService.getCurrentUser();
      setUserProfile(userRes.data);
      console.log('User profile loaded:', userRes.data);
      return address;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect';
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
      if (response.data) {
        setUserProfile(response.data);
      }
    } catch (err: unknown) {
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
