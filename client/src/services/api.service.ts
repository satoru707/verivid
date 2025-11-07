import { UserProfile } from '../context/use-wallet';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class APIService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getHeaders(contentType = 'application/json'): HeadersInit {
    return {
      'Content-Type': contentType,
      Accept: 'application/json',
    };
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
        credentials: 'include',
      });

      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || `HTTP ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error(`[API] Request failed:`, error);
      throw error;
    }
  }

  async getNonce(wallet: string): Promise<{ data: { nonce: string } }> {
    return this.request('/auth/nonce', {
      method: 'POST',
      body: JSON.stringify({ wallet }),
    });
  }

  async verifySignature(
    wallet: string,
    signature: string
  ): Promise<{ data: { user: any } }> {
    return this.request('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ wallet, signature }),
    });
  }

  async logout(): Promise<{ data: { message: string } }> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<{ data: { user: UserProfile } }> {
    return this.request('/api/users/me', {
      method: 'GET',
    });
  }

  async updateUserProfile(data: any): Promise<{ data: { user: UserProfile } }> {
    return this.request('/api/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUserProfile(
    wallet: string
  ): Promise<{ data: { user: UserProfile } }> {
    return this.request(`/api/users/${wallet}`, {
      method: 'GET',
    });
  }

  async initializeUpload(
    file: File
  ): Promise<{ data: { videoId: string; uploadUrl: string } }> {
    return this.request('/api/videos/upload-init', {
      method: 'POST',
      body: JSON.stringify({
        filename: file.name,
        mimeType: file.type,
        size: file.size,
      }),
    });
  }

  async completeUpload(
    videoId: string,
    storageUrl: string,
    metadata?: any
  ): Promise<{ data: { videoId: string } }> {
    return this.request(`/api/videos/${videoId}/upload-complete`, {
      method: 'POST',
      body: JSON.stringify({
        storageUrl,
        ...(metadata?.durationSec && { durationSec: metadata.durationSec }),
        ...(metadata?.width && { width: metadata.width }),
        ...(metadata?.height && { height: metadata.height }),
        ...(metadata?.ipfsCid && { ipfsCid: metadata.ipfsCid }),
      }),
    });
  }

  async listVideos(): Promise<{ data: any[] }> {
    return this.request('/api/videos', {
      method: 'GET',
    });
  }

  async getVideoDetails(videoId: string): Promise<{
    data: {
      video: {
        id: string;
        uploaderId: string;
        originalName: string;
        ipfsCid: string | null;
        storageUrl: string;
        sha256: string;
        durationSec: number | null;
        width: number | null;
        height: number | null;
        verified: boolean;
        verifiedAt: Date | null;
        verifiedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
      };
    };
  }> {
    return this.request(`/api/videos/${videoId}`, {
      method: 'GET',
    });
  }

  async deleteVideo(videoId: string): Promise<{ data: { message: string } }> {
    return this.request(`/api/videos/${videoId}`, {
      method: 'DELETE',
    });
  }

  async checkDuplicate(
    sha256: string
  ): Promise<{ data: { isDuplicate: boolean; existingVideoId?: string } }> {
    return this.request(`/api/videos/check-duplicate`, {
      method: 'POST',
      body: JSON.stringify({ sha256 }),
    });
  }

  async prepareVerification(videoId: string): Promise<{
    data: {
      videoId: string;
      proofHash: string;
      metadataUri: {
        videoId: string;
        title: string;
        sha256: string;
        uploader: string;
        timestamp: string;
        ipfsUri?: string;
      };
      contractAddress: string;
      chainId: string;
    };
  }> {
    return this.request('/api/verify/prepare-tx', {
      method: 'POST',
      body: JSON.stringify({ videoId }),
    });
  }

  async confirmVerification(
    videoId: string,
    txHash: string,
    signer: string,
    proofHash: string
  ): Promise<{
    data: {
      verification: {
        id: string;
        videoId: string;
        txHash: string;
        proofHash: string;
        signer: string;
        chain: string;
        metadataUri: string;
        createdAt: string;
        updatedAt: string;
      };
      video: {
        id: string;
        sha256: string;
        uploaderId: string;
        originalName: string;
        ipfsCid: string | null;
        storageUrl: string;
        durationSec: number | null;
        width: number | null;
        height: number | null;
        verified: boolean;
        verifiedAt: Date | null;
        verifiedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
      };
    };
  }> {
    return this.request('/api/verify/confirm-tx', {
      method: 'POST',
      body: JSON.stringify({ videoId, txHash, signer, proofHash }),
    });
  }

  async getVerification(proofHash: string): Promise<{
    data: {
      onChain: { signer: string; timestamp: string; metadataUri: string };
      dbRecord: any;
    };
  }> {
    return this.request(`/api/verify/${proofHash}`, {
      method: 'GET',
    });
  }

  async requestRecovery(email: string): Promise<{ data: { message: string } }> {
    return this.request('/auth/recover/request', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyRecovery(
    token: string,
    newWallet: string
  ): Promise<{ data: { user: UserProfile } }> {
    return this.request('/auth/recover/verify', {
      method: 'POST',
      body: JSON.stringify({ token, newWallet }),
    });
  }
}

export const apiService = new APIService(API_BASE_URL);
