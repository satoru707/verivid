import { ethers } from 'ethers';

const CONTRACT_ABI = [
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
  {
    inputs: [{ name: 'proofHash', type: 'bytes32' }],
    name: 'getProof',
    outputs: [
      { name: 'signer', type: 'address' },
      { name: 'timestamp', type: 'uint256' },
      { name: 'metadataUri', type: 'string' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private contractAddress: string;

  constructor() {
    const rpcUrl =
      process.env.RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/demo';
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.contractAddress = process.env.CONTRACT_ADDRESS || '';
  }

  async isProofRegistered(proofHash: string): Promise<boolean> {
    try {
      const contract = new ethers.Contract(
        this.contractAddress,
        CONTRACT_ABI,
        this.provider
      );

      const registered = await contract.isRegistered(proofHash);
      return registered;
    } catch (error) {
      console.error('Error checking proof registration:', error);
      return false;
    }
  }

  async getProofDetails(proofHash: string): Promise<{
    signer: string;
    timestamp: string;
    metadataUri: string;
  } | null> {
    try {
      const contract = new ethers.Contract(
        this.contractAddress,
        CONTRACT_ABI,
        this.provider
      );

      const proof = await contract.getProof(proofHash);
      return {
        signer: proof.signer,
        timestamp: proof.timestamp.toString(),
        metadataUri: proof.metadataUri,
      };
    } catch (error) {
      console.error('Error fetching proof details:', error);
      return null;
    }
  }

  async verifyTransaction(txHash: string): Promise<boolean> {
    try {
      const receipt = await this.provider.getTransactionReceipt(txHash);
      return receipt?.status === 1;
    } catch (error) {
      console.error('Error verifying transaction:', error);
      return false;
    }
  }
}
