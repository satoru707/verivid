import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { User, LogOut, Copy, Check } from 'lucide-react';
import { useWallet } from '../context/use-wallet';

interface WalletDropdownProps {
  children: React.ReactNode;
  onNavigateToProfile: () => void;
}

export function WalletDropdown({
  children,
  onNavigateToProfile,
}: WalletDropdownProps) {
  const { walletAddress, disconnectWallet } = useWallet();
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        className="glass-card border-[#A7E6FF]/40 w-64 p-2"
        align="end"
      >
        {/* Wallet Address */}
        <div className="px-3 py-3 mb-2">
          <div
            className="text-[#16213E]/60 mb-2"
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Connected Wallet
          </div>
          <div className="flex items-center gap-2">
            <code
              className="flex-1 text-[#16213E] font-mono truncate"
              style={{ fontSize: '0.875rem', fontWeight: 600 }}
            >
              {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
            </code>
            <button
              type="button"
              onClick={handleCopyAddress}
              className="p-1.5 hover:bg-white/60 rounded-lg transition-colors"
              title="Copy address"
            >
              {copied ? (
                <Check className="w-4 h-4 text-[#A7E6FF]" />
              ) : (
                <Copy className="w-4 h-4 text-[#16213E]/60" />
              )}
            </button>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-[#A7E6FF]/20" />

        {/* Profile */}
        <DropdownMenuItem
          onSelect={onNavigateToProfile}
          className="cursor-pointer px-3 py-2.5 rounded-lg hover:bg-white/60 focus:bg-white/60"
        >
          <User className="w-4 h-4 mr-3 text-[#16213E]/60" />
          <span
            className="text-[#16213E]"
            style={{ fontSize: '0.9375rem', fontWeight: 500 }}
          >
            View Profile
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-[#A7E6FF]/20" />

        {/* Disconnect */}
        <DropdownMenuItem
          onSelect={handleDisconnect}
          className="cursor-pointer px-3 py-2.5 rounded-lg hover:bg-red-50 focus:bg-red-50 text-red-600"
        >
          <LogOut className="w-4 h-4 mr-3" />
          <span style={{ fontSize: '0.9375rem', fontWeight: 500 }}>
            Disconnect Wallet
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
