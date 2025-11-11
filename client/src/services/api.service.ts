interface User {
  id: string;
  wallet: string;
  username?: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface Video {
  id: string;
  uploaderId: string;
  originalName: string;
  sha256: string;
  storageUrl: string;
  ipfsCid?: string;
  verified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  durationSec?: number;
  width?: number;
  height?: number;
  createdAt: string;
  updatedAt: string;
}

interface Verification {
  id: string;
  videoId: string;
  txHash: string;
  proofHash: string;
  signer: string;
  chain: string;
  metadataUri?: string;
  createdAt: string;
  updatedAt: string;
}

interface NonceResponse {
  nonce: string;
}

interface VerifySignatureResponse {
  user: User;
  token?: string;
}

interface UploadInitResponse {
  videoId: string;
  uploadUrl: string;
  fields?: Record<string, string>;
}

interface UploadCompleteResponse {
  videoId: string;
  storageUrl: string;
}

interface PrepareVerificationResponse {
  videoId: string;
  proofHash: string;
  metadata: {
    videoId: string;
    title: string;
    sha256: string;
    uploader: string;
    timestamp: string;
    ipfsUri?: string;
  };
  contractAddress: string;
  chainId: string;
}

interface ConfirmVerificationResponse {
  verification: Verification;
  video: Video;
  success: boolean;
}

interface VerifyFileHashResponse {
  verified: boolean;
  video?: Video;
  verifications?: Verification[];
}

interface CheckDuplicateResponse {
  isDuplicate: boolean;
  existingVideoId?: string;
}

interface ApiResponse<T> {
  error: string | null;
  data: T;
}

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

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    console.log('URL', url);
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
        credentials: 'include',
      });
      console.log('Response Status:', response.status);

      if (response.status === 204) {
        return { error: null, data: {} as T };
      }

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(
          (data.error || data.data || `HTTP ${response.status}`) as string
        );
      }

      return data;
    } catch (error) {
      console.error('[API] Request failed:', error);
      throw error;
    }
  }

  async login(wallet: string): Promise<ApiResponse<{ token: string }>> {
    return this.request<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ wallet }),
    });
  }

  async getNonce(wallet: string): Promise<ApiResponse<NonceResponse>> {
    return this.request<NonceResponse>('/auth/nonce', {
      method: 'POST',
      body: JSON.stringify({ wallet }),
    });
  }

  async verifySignature(
    wallet: string,
    signature: string
  ): Promise<ApiResponse<VerifySignatureResponse>> {
    return this.request<VerifySignatureResponse>('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ wallet, signature }),
    });
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/api/users/me', {
      method: 'GET',
    });
  }

  async updateUserProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/api/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUserProfile(wallet: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/api/users/${wallet}`, {
      method: 'GET',
    });
  }

  async initializeUpload(file: File): Promise<ApiResponse<UploadInitResponse>> {
    return this.request<UploadInitResponse>('/api/videos/upload-init', {
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
    metadata?: {
      sha256?: string;
      durationSec?: number;
      width?: number;
      height?: number;
      ipfsCid?: string;
    }
  ): Promise<ApiResponse<UploadCompleteResponse>> {
    return this.request<UploadCompleteResponse>(
      `/api/videos/${videoId}/upload-complete`,
      {
        method: 'POST',
        body: JSON.stringify({
          storageUrl,
          ...(metadata?.sha256 && { sha256: metadata.sha256 }),
          ...(metadata?.durationSec && { durationSec: metadata.durationSec }),
          ...(metadata?.width && { width: metadata.width }),
          ...(metadata?.height && { height: metadata.height }),
          ...(metadata?.ipfsCid && { ipfsCid: metadata.ipfsCid }),
        }),
      }
    );
  }

  async listVideos(): Promise<ApiResponse<Video[]>> {
    return this.request<Video[]>('/api/videos', {
      method: 'GET',
    });
  }

  async getVideoDetails(videoId: string): Promise<ApiResponse<Video>> {
    return this.request<Video>(`/api/videos/${videoId}`, {
      method: 'GET',
    });
  }

  async deleteVideo(
    videoId: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/api/videos/${videoId}`, {
      method: 'DELETE',
    });
  }

  async checkDuplicate(
    sha256: string
  ): Promise<ApiResponse<CheckDuplicateResponse>> {
    return this.request<CheckDuplicateResponse>('/api/videos/check-duplicate', {
      method: 'POST',
      body: JSON.stringify({ sha256 }),
    });
  }

  async verifyFileHash(
    sha256: string
  ): Promise<ApiResponse<VerifyFileHashResponse>> {
    return this.request<VerifyFileHashResponse>('/api/videos/verify-hash', {
      method: 'POST',
      body: JSON.stringify({ sha256 }),
    });
  }

  async prepareVerification(
    videoId: string
  ): Promise<ApiResponse<PrepareVerificationResponse>> {
    return this.request<PrepareVerificationResponse>('/api/verify/prepare-tx', {
      method: 'POST',
      body: JSON.stringify({ videoId }),
    });
  }

  async confirmVerification(
    videoId: string,
    txHash: string,
    signer: string,
    proofHash: string
  ): Promise<ApiResponse<ConfirmVerificationResponse>> {
    return this.request<ConfirmVerificationResponse>('/api/verify/confirm-tx', {
      method: 'POST',
      body: JSON.stringify({ videoId, txHash, signer, proofHash }),
    });
  }

  async getVerification(proofHash: string): Promise<ApiResponse<Verification>> {
    return this.request<Verification>(`/api/verify/${proofHash}`, {
      method: 'GET',
    });
  }

  async requestRecovery(
    email: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/auth/recover/request', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyRecovery(
    token: string,
    newWallet: string
  ): Promise<ApiResponse<VerifySignatureResponse>> {
    return this.request<VerifySignatureResponse>('/auth/recover/verify', {
      method: 'POST',
      body: JSON.stringify({ token, newWallet }),
    });
  }
}

export const apiService = new APIService(API_BASE_URL);
