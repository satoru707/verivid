import { MetaMaskSDK } from '@metamask/sdk';
import { ethers } from 'ethers';
import { apiService } from './api.service';

const metamaskSDK = new MetaMaskSDK({
  dappMetadata: {
    name: 'VeriVid',
    url: window.location.origin,
  },
  logging: { developerMode: false },
  preferDesktop: false,
});

export type WalletType = 'metamask';

class WalletService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private provider: any = null;
  private address: string | null = null;
  private signer: ethers.Signer | null = null;

  async connect(): Promise<string> {
    try {
      const mmProvider = metamaskSDK.getProvider();

      if (!mmProvider) {
        throw new Error(
          'MetaMask is not installed. Please install MetaMask extension or use mobile app.'
        );
      }

      const accounts = (await mmProvider.request({
        method: 'eth_requestAccounts',
      })) as string[];

      if (!accounts || accounts?.length === 0) {
        throw new Error('No accounts returned from MetaMask');
      }

      const checksummedAddress = ethers.getAddress(accounts[0]);
      this.address = checksummedAddress;
      this.provider = mmProvider;

      const nonceResponse = await apiService.getNonce(checksummedAddress);
      const nonce = nonceResponse.data.nonce;

      const ethersProvider = new ethers.BrowserProvider(mmProvider);
      this.signer = await ethersProvider.getSigner();

      const message = `VeriVid Authentication\n\nNonce: ${nonce}`;
      const signature = await this.signer.signMessage(message);

      const verifyResponse = await apiService.verifySignature(
        checksummedAddress,
        signature
      );

      if (!verifyResponse.data.user) {
        throw new Error('Signature verification failed');
      }

      return checksummedAddress;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('[Wallet] Connection failed:', err);
      if (
        err.message?.includes('User rejected') ||
        err.message?.includes('User closed')
      ) {
        throw new Error('Connection rejected by user');
      }
      throw err;
    }
  }

  async disconnect() {
    try {
      await apiService.logout();
      if (this.provider?.disconnect) {
        await this.provider.disconnect();
      }
      if (this.provider?.close) {
        await this.provider.close();
      }
    } catch (error) {
      console.error('[Wallet] Disconnect error:', error);
    }

    this.provider = null;
    this.address = null;
    this.signer = null;
  }

  async signMessage(message: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }
    return this.signer.signMessage(message);
  }

  async sendTransaction(tx: ethers.ContractTransaction): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }
    const response = await this.signer.sendTransaction(tx);
    return response.hash;
  }

  getAddress() {
    return this.address;
  }

  getProvider() {
    return this.provider;
  }

  getSigner() {
    return this.signer;
  }

  isConnected() {
    return !!this.address && !!this.provider;
  }
}

export const walletService = new WalletService();
