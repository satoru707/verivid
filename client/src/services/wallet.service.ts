import { MetaMaskSDK } from '@metamask/sdk';
import { ethers } from 'ethers';
import { apiService } from './api.service';

class WalletService {
  private sdk: MetaMaskSDK | null = null;
  private address: string | null = null;

  private async initializeSDK(): Promise<void> {
    if (this.sdk) return;

    console.log('[Wallet] Initializing MetaMask SDK (QR-flow only)');

    this.sdk = new MetaMaskSDK({
      dappMetadata: {
        name: 'VeriVid',
        url: location.origin,
      },
      injectProvider: false, // disable extension provider
      useDeeplink: true, // enable deeplink/QR mode
      checkInstallationImmediately: false,
      logging: { developerMode: true },
      storage: { enabled: true },
      communicationServerUrl: 'https://metamask-sdk.bridge.walletconnect.org', // default or your own
    });

    await this.sdk.init();
    console.log('[Wallet] SDK initialized in QR mode');
  }

  async connect(): Promise<string> {
    try {
      console.log('[Wallet] Starting connection (QR scan) …');
      await this.initializeSDK();

      if (!this.sdk) throw new Error('SDK not initialized');

      console.log('[Wallet] Calling SDK.connect() …');
      const accounts = await this.sdk.connect();
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from connection');
      }

      const checksummed = ethers.getAddress(accounts[0]);
      this.address = checksummed;
      console.log('[Wallet] Connected address:', checksummed);

      // Get nonce
      const nonceRes = await apiService.getNonce(checksummed);
      const nonce = nonceRes.data?.nonce;
      if (!nonce) throw new Error('No nonce received from server');

      // Sign message
      const message = `VeriVid Authentication: ${nonce}`;
      console.log('[Wallet] Signing message …');
      const signature = await this.sdk.connectAndSign({ msg: message });
      console.log('[Wallet] Signature:', signature);

      // Verify signature
      const verifyRes = await apiService.verifySignature(
        checksummed,
        signature
      );
      if (!verifyRes.data?.user) {
        throw new Error('Signature verification failed');
      }

      // Store auth
      localStorage.setItem('verivid_wallet', checksummed);
      localStorage.setItem('verivid_auth', verifyRes.data.token || '');
      console.log('[Wallet] Fully authenticated');

      return checksummed;
    } catch (err: any) {
      console.error('[Wallet] connect error:', err);
      if (err.code === 4001) {
        throw new Error('Connection rejected by user');
      }
      if (err.message?.includes('timeout')) {
        throw new Error('Connection timed out — please try again');
      }
      throw err;
    }
  }

  async signMessage(nonce: string): Promise<string> {
    if (!this.sdk) throw new Error('SDK not initialized');
    try {
      const message = `VeriVid Authentication: ${nonce}`;
      console.log('[Wallet] Signing message:', message);
      const signature = await this.sdk.connectAndSign({ msg: message });
      console.log('[Wallet] Signature successful:', signature);
      return signature as string;
    } catch (err: any) {
      console.error('[Wallet] signMessage error:', err);
      if (err.code === 4001) {
        throw new Error('Signature rejected by user');
      }
      throw err;
    }
  }

  async disconnect(): Promise<void> {
    try {
      console.log('[Wallet] Disconnecting …');
      await apiService.logout();
      if (this.sdk) {
        await this.sdk.terminate();
      }
    } catch (e) {
      console.error('[Wallet] disconnect error:', e);
    } finally {
      this.sdk = null;
      this.address = null;
      localStorage.removeItem('verivid_wallet');
      localStorage.removeItem('verivid_auth');
      console.log('[Wallet] Disconnected and cleaned up');
    }
  }

  getProvider() {
    return this.sdk?.getProvider();
  }

  getAddress() {
    return this.address;
  }

  isConnected() {
    return !!this.address && !!this.sdk;
  }

  isInitialized() {
    return this.sdk?.isInitialized() || false;
  }
}

export const walletService = new WalletService();
