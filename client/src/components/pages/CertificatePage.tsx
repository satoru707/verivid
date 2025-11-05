import {
  ExternalLink,
  Copy,
  Calendar,
  Hash,
  User,
  Download,
  Share2,
  Sparkles,
  Check,
} from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

export function CertificatePage() {
  const certificateData = {
    title: 'My Creative Video Project',
    thumbnail:
      'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800',
    owner: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    timestamp: 'November 3, 2025 at 2:30 PM UTC',
    blockchainHash:
      '0xf4d7b5c3a2e1f8d9c6b3a7e2f1d8c5b2a9e6d3f0c7b4a1e8d5c2b9f6a3e0d7c4',
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl overflow-hidden p-10 relative shadow-xl"
        >
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A7E6FF] to-[#C6A0F6] mb-4 glow-ice shadow-lg">
                <Check className="w-8 h-8 text-[#16213E]" strokeWidth={2.5} />
              </div>
              <h2
                className="text-[#16213E] mb-2"
                style={{ fontSize: '1.75rem', fontWeight: 800 }}
              >
                Certificate of Authenticity
              </h2>
              <p
                className="text-[#16213E]/60"
                style={{ fontSize: '0.9375rem' }}
              >
                Blockchain-verified ownership proof
              </p>
            </div>

            <div className="aspect-video bg-gradient-to-br from-[#C9D6DF] to-[#A7E6FF] rounded-2xl mb-6 overflow-hidden shadow-lg">
              <img
                src={certificateData.thumbnail}
                alt={certificateData.title}
                className="w-full h-full object-cover"
              />
            </div>

            <h3
              className="text-[#16213E] mb-6 text-center"
              style={{ fontSize: '1.25rem', fontWeight: 700 }}
            >
              {certificateData.title}
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-5 bg-white/60 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#A7E6FF]/30 to-[#C6A0F6]/30 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-[#16213E]" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-[#16213E]/60 mb-1"
                    style={{ fontSize: '0.8125rem', fontWeight: 500 }}
                  >
                    Owner Address
                  </div>
                  <div
                    className="text-[#16213E] break-all font-mono"
                    style={{ fontSize: '0.9375rem', fontWeight: 600 }}
                  >
                    {certificateData.owner}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(certificateData.owner)}
                  className="p-2 hover:bg-white/70 rounded-lg transition-colors flex-shrink-0"
                >
                  <Copy className="w-4 h-4 text-[#16213E]" />
                </button>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white/60 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#A7E6FF]/30 to-[#C6A0F6]/30 flex items-center justify-center flex-shrink-0">
                  <Calendar
                    className="w-5 h-5 text-[#16213E]"
                    strokeWidth={2}
                  />
                </div>
                <div className="flex-1">
                  <div
                    className="text-[#16213E]/60 mb-1"
                    style={{ fontSize: '0.8125rem', fontWeight: 500 }}
                  >
                    Verification Date
                  </div>
                  <div
                    className="text-[#16213E]"
                    style={{ fontSize: '0.9375rem', fontWeight: 600 }}
                  >
                    {certificateData.timestamp}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white/60 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#A7E6FF]/30 to-[#C6A0F6]/30 flex items-center justify-center flex-shrink-0">
                  <Hash className="w-5 h-5 text-[#16213E]" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-[#16213E]/60 mb-1"
                    style={{ fontSize: '0.8125rem', fontWeight: 500 }}
                  >
                    Blockchain Transaction Hash
                  </div>
                  <div
                    className="text-[#16213E] break-all font-mono"
                    style={{ fontSize: '0.8125rem', fontWeight: 600 }}
                  >
                    {certificateData.blockchainHash}
                  </div>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(certificateData.blockchainHash)
                  }
                  className="p-2 hover:bg-white/70 rounded-lg transition-colors flex-shrink-0"
                >
                  <Copy className="w-4 h-4 text-[#16213E]" />
                </button>
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-[#A7E6FF] to-[#C6A0F6] text-[#16213E] hover:shadow-xl transition-all glow-ice border-0 h-12 mb-6"
              style={{ fontSize: '0.9375rem', fontWeight: 600 }}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Blockchain Explorer
            </Button>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 glass-card rounded-full px-6 py-3 glow-lilac">
                <Sparkles className="w-5 h-5 text-[#C6A0F6]" fill="#C6A0F6" />
                <span
                  className="text-gradient"
                  style={{ fontSize: '0.9375rem', fontWeight: 700 }}
                >
                  VeriVid Certified
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6"
        >
          <Button
            variant="outline"
            className="glass-card text-[#16213E] border-[#A7E6FF]/40 hover:bg-white/60 h-12 px-6 w-full sm:w-auto"
            style={{ fontSize: '0.9375rem', fontWeight: 600 }}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Certificate
          </Button>
          <Button
            variant="outline"
            className="glass-card text-[#16213E] border-[#A7E6FF]/40 hover:bg-white/60 h-12 px-6 w-full sm:w-auto"
            style={{ fontSize: '0.9375rem', fontWeight: 600 }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Certificate
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6 mt-8"
        >
          <h3
            className="text-[#16213E] mb-3"
            style={{ fontSize: '1.125rem', fontWeight: 700 }}
          >
            What does this mean?
          </h3>
          <div
            className="space-y-3 text-[#16213E]/70"
            style={{ fontSize: '0.9375rem', lineHeight: 1.7 }}
          >
            <p>
              This certificate proves that this video was verified on the
              blockchain at the specified time. The blockchain hash is a unique
              fingerprint that cannot be altered or duplicated.
            </p>
            <p>
              Anyone can verify the authenticity of this certificate by checking
              the blockchain explorer or using VeriVid's authenticity checker.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
