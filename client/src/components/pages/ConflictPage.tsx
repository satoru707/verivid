import {
  AlertTriangle,
  Calendar,
  User,
  Hash,
  CheckCircle,
  Info,
} from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

export function ConflictPage() {
  const originalVerification = {
    title: 'Summer Vacation Vlog 2024',
    owner: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    timestamp: 'October 15, 2024 at 3:45 PM UTC',
    blockchainHash:
      '0xf4d7b5c3a2e1f8d9c6b3a7e2f1d8c5b2a9e6d3f0c7b4a1e8d5c2b9f6a3e0d7c4',
    thumbnail:
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
  };

  const conflictingUpload = {
    title: 'My Vacation Video',
    owner: '0x8b3e2f1c9d7a5b4e3f2c1d9a8b7e6f5c4d3a2b1e0f9c8d7a6b5e4f3c2d1a0b9',
    timestamp: 'October 28, 2024 at 1:20 PM UTC',
    blockchainHash:
      '0xa9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8',
    thumbnail:
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
  };

  const DetailCard = ({
    data,
    isOriginal,
  }: {
    data: typeof originalVerification;
    isOriginal: boolean;
  }) => (
    <div
      className={`glass-card rounded-2xl p-6 relative ${!isOriginal && 'opacity-75'}`}
    >
      {isOriginal && (
        <div className="absolute -top-3 -right-3">
          <div className="glass-strong rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
            <CheckCircle className="w-4 h-4 text-green-500" strokeWidth={2.5} />
            <span
              className="text-[#16213E]"
              style={{ fontSize: '0.8125rem', fontWeight: 700 }}
            >
              Original
            </span>
          </div>
        </div>
      )}

      {!isOriginal && (
        <div className="glass-strong rounded-full px-4 py-2 inline-flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-[#C6A0F6]" strokeWidth={2.5} />
          <span
            className="text-[#16213E]"
            style={{ fontSize: '0.8125rem', fontWeight: 700 }}
          >
            Duplicate
          </span>
        </div>
      )}

      <h3
        className="text-[#16213E] mb-4"
        style={{ fontSize: '1.125rem', fontWeight: 700 }}
      >
        {isOriginal ? 'First Verification' : 'Later Upload'}
      </h3>

      {/* Video Preview */}
      <div className="aspect-video bg-gradient-to-br from-[#C9D6DF] to-[#A7E6FF] rounded-xl mb-4 overflow-hidden">
        <img
          src={data.thumbnail}
          alt={data.title}
          className="w-full h-full object-cover"
        />
      </div>

      <h4
        className="text-[#16213E] mb-4"
        style={{ fontSize: '1rem', fontWeight: 600 }}
      >
        {data.title}
      </h4>

      <div className="space-y-3">
        <div className="flex items-start gap-3 p-4 bg-white/50 rounded-xl">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#A7E6FF]/30 to-[#C6A0F6]/30 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-[#16213E]" />
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="text-[#16213E]/60 mb-1"
              style={{ fontSize: '0.8125rem', fontWeight: 500 }}
            >
              Owner
            </div>
            <div
              className="text-[#16213E] break-all font-mono"
              style={{ fontSize: '0.8125rem', fontWeight: 600 }}
            >
              {data.owner}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-white/50 rounded-xl">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#A7E6FF]/30 to-[#C6A0F6]/30 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-[#16213E]" />
          </div>
          <div className="flex-1">
            <div
              className="text-[#16213E]/60 mb-1"
              style={{ fontSize: '0.8125rem', fontWeight: 500 }}
            >
              Timestamp
            </div>
            <div
              className="text-[#16213E]"
              style={{ fontSize: '0.8125rem', fontWeight: 600 }}
            >
              {data.timestamp}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-white/50 rounded-xl">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#A7E6FF]/30 to-[#C6A0F6]/30 flex items-center justify-center flex-shrink-0">
            <Hash className="w-5 h-5 text-[#16213E]" />
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="text-[#16213E]/60 mb-1"
              style={{ fontSize: '0.8125rem', fontWeight: 500 }}
            >
              Hash
            </div>
            <div
              className="text-[#16213E] break-all font-mono"
              style={{ fontSize: '0.75rem', fontWeight: 600 }}
            >
              {data.blockchainHash}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-6 py-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-[#C6A0F6]" />
            <span
              className="text-[#16213E]"
              style={{ fontSize: '0.9375rem', fontWeight: 600 }}
            >
              Conflict Resolution
            </span>
          </div>
          <h1
            className="text-[#16213E] mb-4"
            style={{
              fontSize: 'clamp(2rem, 5vw, 2.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}
          >
            Duplicate Detection
          </h1>
          <p
            className="text-[#16213E]/70 max-w-2xl mx-auto"
            style={{ fontSize: '1.0625rem', lineHeight: 1.6 }}
          >
            This video content has been previously verified. The earliest
            verification is considered the original.
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-6 mb-8"
        >
          <DetailCard data={originalVerification} isOriginal={true} />
          <DetailCard data={conflictingUpload} isOriginal={false} />
        </motion.div>

        {/* Divider with explanation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative mb-8"
        >
          <div className="glass-strong rounded-2xl px-6 py-3 flex items-center gap-3 max-w-2xl mx-auto">
            <Info className="w-5 h-5 text-[#A7E6FF] flex-shrink-0" />
            <span
              className="text-[#16213E]"
              style={{ fontSize: '0.875rem', fontWeight: 600 }}
            >
              The video on the left was verified first and is considered the
              original
            </span>
          </div>
        </motion.div>

        {/* Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-8"
        >
          <h3
            className="text-[#16213E] mb-4"
            style={{ fontSize: '1.25rem', fontWeight: 700 }}
          >
            How VeriVid Resolves Conflicts
          </h3>
          <div
            className="space-y-4 text-[#16213E]/70 mb-6"
            style={{ fontSize: '0.9375rem', lineHeight: 1.7 }}
          >
            <p>
              When multiple users attempt to verify the same video content,
              VeriVid uses blockchain timestamps to determine the original
              verification. The earliest verified upload is considered
              authentic.
            </p>
            <p>
              This system ensures that creators who verify their content first
              receive proper recognition and protection. All subsequent uploads
              of the same content are flagged as duplicates.
            </p>
            <p>
              If you believe you are the rightful owner of the original content,
              you can submit an appeal with additional evidence for manual
              review.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <Button
              className="bg-gradient-to-r from-[#A7E6FF] to-[#C6A0F6] text-[#16213E] hover:shadow-xl transition-all glow-ice border-0 h-12"
              style={{ fontSize: '0.9375rem', fontWeight: 600 }}
            >
              View Original Certificate
            </Button>
            <Button
              variant="outline"
              className="glass-card text-[#16213E] border-[#A7E6FF]/40 hover:bg-white/60 h-12"
              style={{ fontSize: '0.9375rem', fontWeight: 600 }}
            >
              Submit Appeal
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
