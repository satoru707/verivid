import { Wallet, Mail, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

interface AuthPageProps {
  onBack: () => void;
}

export function AuthPage({ onBack }: AuthPageProps) {
  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center px-6 sm:px-8">
      <div className="max-w-md w-full">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 text-[#16213E]/60 hover:text-[#16213E] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span style={{ fontSize: '1rem', fontWeight: 500 }}>
            Back to Home
          </span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-strong rounded-2xl p-10 text-center relative overflow-hidden shadow-xl"
        >
          {/* Content */}
          <div className="relative z-10">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A7E6FF] to-[#C6A0F6] mb-6 glow-ice shadow-lg mx-auto">
              <Sparkles className="w-8 h-8 text-[#16213E]" fill="#16213E" />
            </div>

            {/* Title */}
            <h2
              className="text-[#16213E] mb-2"
              style={{ fontSize: '1.5rem', fontWeight: 800 }}
            >
              Connect Your Wallet
            </h2>
            <p
              className="text-[#16213E]/70 mb-8"
              style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}
            >
              Your wallet is your digital signature.
              <br />
              Sign in to verify and protect your videos.
            </p>

            {/* Auth Options */}
            <div className="space-y-3 mb-6">
              <Button
                className="w-full bg-gradient-to-r from-[#A7E6FF] to-[#C6A0F6] text-[#16213E] hover:shadow-xl hover:scale-105 transition-all glow-ice border-0 h-12"
                style={{ fontSize: '0.9375rem', fontWeight: 600 }}
              >
                <Wallet className="w-4 h-4 mr-2" />
                Login with Wallet
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C9D6DF]/50 to-transparent"></div>
                </div>
                <div className="relative flex justify-center">
                  <span
                    className="px-4 glass-strong text-[#16213E]/50 rounded-full"
                    style={{ fontSize: '0.8125rem', fontWeight: 500 }}
                  >
                    or
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full glass-card text-[#16213E] border-[#A7E6FF]/40 hover:bg-white/60 h-12"
                style={{ fontSize: '0.9375rem', fontWeight: 600 }}
              >
                <Mail className="w-4 h-4 mr-2" />
                Login with Email
              </Button>
            </div>

            {/* Info */}
            <p
              className="text-[#16213E]/50"
              style={{ fontSize: '0.8125rem', lineHeight: 1.6 }}
            >
              By connecting, you agree to our Terms of Service
              <br />
              and Privacy Policy
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
