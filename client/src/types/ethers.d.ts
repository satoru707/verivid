import type { BytesLike } from 'ethers';

// Extend ethers' BytesLike to accept Node.js Buffer
declare module 'ethers' {
  interface BytesLike {
    // Allow Node Buffer (which extends Uint8Array<ArrayBufferLike>)
    [index: number]: number;
    buffer: ArrayBufferLike;
    byteLength: number;
    slice(start?: number, end?: number): Uint8Array;
    subarray(start?: number, end?: number): Uint8Array;
  }

  // Explicitly widen Buffer → BytesLike
  function getBytes(value: Buffer): Uint8Array;
  function getBytesCopy(value: Buffer): Uint8Array;
}
