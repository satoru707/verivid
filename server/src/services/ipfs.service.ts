import fetch from "node-fetch"

export interface IPFSPinResponse {
  IpfsHash: string
  PinSize: number
  Timestamp: string
}

export class IPFSService {
  private apiKey: string
  private gatewayUrl: string

  constructor() {
    this.apiKey = process.env.IPFS_API_KEY || ""
    this.gatewayUrl = process.env.IPFS_GATEWAY || "https://ipfs.io"
  }

  async pinFile(filePath: string, fileName: string): Promise<string> {
    // In production: use Pinata or Infura API
    console.log(`[IPFS] Would pin ${fileName} to IPFS`)
    return `QmExampleHash${Date.now()}`
  }

  async pinJSON(data: object, name: string): Promise<string> {
    // Store metadata JSON on IPFS
    console.log(`[IPFS] Would pin metadata: ${name}`)
    return `QmMetadataHash${Date.now()}`
  }

  getGatewayUrl(ipfsHash: string): string {
    return `${this.gatewayUrl}/ipfs/${ipfsHash}`
  }

  // Retrieve JSON from IPFS
  async getJSON(ipfsHash: string): Promise<object> {
    const url = this.getGatewayUrl(ipfsHash)
    try {
      const response = await fetch(url)
      return response.json()
    } catch (error) {
      console.error(`Failed to fetch from IPFS: ${error}`)
      throw error
    }
  }
}
