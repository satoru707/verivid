import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

export interface IPFSPinResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export class IPFSService {
  private apiKey: string;
  private gatewayUrl: string;
  private pinataEndpoint: string = 'https://api.pinata.cloud/pinning';

  constructor() {
    this.apiKey = process.env.IPFS_API_KEY!;
    if (!this.apiKey) {
      throw new Error('IPFS_API_KEY is not defined in environment variables');
    }
    this.gatewayUrl = process.env.IPFS_GATEWAY || 'https://ipfs.io';
  }

  async pinFile(filePath: string, fileName: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath), {
        filename: fileName,
      });

      const response = await fetch(`${this.pinataEndpoint}/pinFileToIPFS`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Pinata API error: ${response.statusText}`);
      }

      const result = (await response.json()) as IPFSPinResponse;
      return result.IpfsHash;
    } catch (error) {
      console.error('Error pinning file to IPFS:', error);
      throw error;
    }
  }

  async pinJSON(data: object, name: string): Promise<string> {
    try {
      const response = await fetch(`${this.pinataEndpoint}/pinJSONToIPFS`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          pinataContent: data,
          pinataMetadata: { name },
        }),
      });

      if (!response.ok) {
        throw new Error(`Pinata API error: ${response.statusText}`);
      }

      const result = (await response.json()) as IPFSPinResponse;
      return result.IpfsHash;
    } catch (error) {
      console.error('Error pinning JSON to IPFS:', error);
      throw error;
    }
  }

  getGatewayUrl(ipfsHash: string): string {
    return `${this.gatewayUrl}/ipfs/${ipfsHash}`;
  }

  async getJSON(ipfsHash: string): Promise<object> {
    const url = this.getGatewayUrl(ipfsHash);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`IPFS fetch error: ${response.statusText}`);
      }
      return (await response.json()) as Promise<object>;
    } catch (error) {
      console.error(`Failed to fetch from IPFS: ${error}`);
      throw error;
    }
  }
}
