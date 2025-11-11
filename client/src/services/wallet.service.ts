import { ethers } from 'ethers';
import { apiService } from './api.service';

declare global {
  interface Window {
    phantom?: {
      ethereum?: ethers.Eip1193Provider;
    };
  }
}

class WalletService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private address: string | null = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async connect(): Promise<{ address: string; user: any }> {
    try {
      if (!window.phantom?.ethereum) {
        throw new Error(
          'Phantom Wallet not detected. Install from phantom.app'
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const eth = window.phantom.ethereum as any;
      if (!eth.isPhantom) throw new Error('Phantom not active');

      const accounts = await eth.request({ method: 'eth_requestAccounts' });
      if (!accounts?.length) throw new Error('No accounts');

      const rawAddress = accounts[0] as string;
      const address = ethers.getAddress(rawAddress);
      this.address = address;

      this.provider = new ethers.BrowserProvider(eth);
      this.signer = await this.provider.getSigner();
      const nonceRes = await apiService.getNonce(address);
      const nonce = nonceRes.data.nonce;

      const domain = { name: 'VeriVid', version: '1' };
      const types = {
        Authentication: [
          { name: 'message', type: 'string' },
          { name: 'nonce', type: 'string' },
        ],
      };
      const value = { message: 'VeriVid Authentication', nonce };
      const signature = await this.signer.signTypedData(domain, types, value);
      const verifyRes = await apiService.verifySignature(address, signature);
      if (verifyRes.error) throw new Error(verifyRes.error);
      const { user, token } = verifyRes.data;
      localStorage.setItem('verivid_wallet', address);
      if (token) localStorage.setItem('verivid_auth', token);
      console.log('[Wallet] Authenticated:', user.id);
      return { address, user };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('[Wallet] Error:', err);
      if (err.code === 4001) throw new Error('User rejected');
      throw err;
    }
  }

  async signMessage(nonce: string): Promise<string> {
    if (!this.signer) throw new Error('Not connected');
    const message = `VeriVid Authentication: ${nonce}`;
    return await this.signer.signMessage(message);
  }

  async disconnect(): Promise<void> {
    this.provider = null;
    this.signer = null;
    this.address = null;
    localStorage.removeItem('verivid_wallet');
    localStorage.removeItem('verivid_auth');
    console.log('[Wallet] Disconnected');
  }

  getProvider() {
    return this.provider;
  }

  getAddress() {
    return this.address;
  }

  isConnected() {
    return !!this.address && !!this.provider;
  }
}

export const walletService = new WalletService();
