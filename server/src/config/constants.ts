export const UPLOAD_MAX_SIZE = 5 * 1024 * 1024 * 1024;
export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',
];
export const NONCE_EXPIRY_MINUTES = 5;
export const JWT_EXPIRY_DAYS = 7;
export const RATE_LIMIT_WINDOW_MS = 60000;
export const RATE_LIMIT_MAX_REQUESTS = 100;

export const CONTRACT_ABI = [
  {
    inputs: [
      { name: 'proofHash', type: 'bytes32' },
      { name: 'metadataUri', type: 'string' },
    ],
    name: 'registerProof',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'proofHash', type: 'bytes32' }],
    name: 'isRegistered',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
];
