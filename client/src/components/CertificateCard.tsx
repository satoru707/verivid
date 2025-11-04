import { ExternalLink, Copy, Calendar, Hash, User } from 'lucide-react';
import { VerificationBadge } from './VerificationBadge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CertificateCardProps {
  title: string;
  thumbnail?: string;
  owner: string;
  timestamp: string;
  blockchainHash: string;
  onViewExplorer?: () => void;
}

export function CertificateCard({ title, thumbnail, owner, timestamp, blockchainHash, onViewExplorer }: CertificateCardProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="glass-card rounded-3xl overflow-hidden max-w-2xl w-full mx-auto p-8 relative">
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-animation pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-3">
            <VerificationBadge size="lg" />
          </div>
          <h2 className="text-[#16213E] mb-2">Certificate of Authenticity</h2>
          <p className="text-[#16213E]/60">Blockchain-verified ownership proof</p>
        </div>

        {/* Video Preview */}
        <div className="aspect-video bg-gradient-to-br from-[#C9D6DF] to-[#A7E6FF] rounded-2xl mb-6 overflow-hidden">
          {thumbnail ? (
            <ImageWithFallback
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                <div className="w-0 h-0 border-t-10 border-t-transparent border-l-16 border-l-white border-b-10 border-b-transparent ml-2"></div>
              </div>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-[#16213E] mb-6 text-center">{title}</h3>

        {/* Details */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3 p-4 bg-white/30 rounded-xl">
            <User className="w-5 h-5 text-[#16213E] mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[#16213E]/60 mb-1" style={{ fontSize: '0.875rem' }}>Owner</div>
              <div className="text-[#16213E] break-all">{owner}</div>
            </div>
            <button
              onClick={() => copyToClipboard(owner)}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors flex-shrink-0"
            >
              <Copy className="w-4 h-4 text-[#16213E]" />
            </button>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white/30 rounded-xl">
            <Calendar className="w-5 h-5 text-[#16213E] mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-[#16213E]/60 mb-1" style={{ fontSize: '0.875rem' }}>Verification Date</div>
              <div className="text-[#16213E]">{timestamp}</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white/30 rounded-xl">
            <Hash className="w-5 h-5 text-[#16213E] mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[#16213E]/60 mb-1" style={{ fontSize: '0.875rem' }}>Blockchain Hash</div>
              <div className="text-[#16213E] break-all font-mono" style={{ fontSize: '0.875rem' }}>{blockchainHash}</div>
            </div>
            <button
              onClick={() => copyToClipboard(blockchainHash)}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors flex-shrink-0"
            >
              <Copy className="w-4 h-4 text-[#16213E]" />
            </button>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={onViewExplorer}
          className="w-full bg-gradient-to-r from-[#A7E6FF] to-[#C6A0F6] text-[#16213E] hover:shadow-lg transition-all glow-ice"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View on Blockchain Explorer
        </Button>

        {/* VeriVid Badge */}
        <div className="mt-8 text-center">
          <div className="inline-block glass rounded-full px-6 py-3 glow-lilac">
            <span className="text-[#C6A0F6]" style={{ fontWeight: 600 }}>🏔️ VeriVid Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
