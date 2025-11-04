import {
  Upload,
  Search,
  Shield,
  Lock,
  Globe,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { Link} from '@tanstack/react-router'
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

export function LandingPage() {
  return (
    <div className="h-screen w-full overflow-hidden relative flex items-center justify-center">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#A7E6FF] rounded-full opacity-20 blur-3xl animate-float"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C6A0F6] rounded-full opacity-20 blur-3xl animate-float"
        style={{ animationDelay: '2s' }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 glass rounded-full px-6 py-3 mb-8"
            >
              <Sparkles className="w-5 h-5 text-[#C6A0F6]" fill="#C6A0F6" />
              <span
                className="text-[#16213E]"
                style={{ fontSize: '0.9375rem', fontWeight: 600 }}
              >
                Blockchain-Verified Authenticity
              </span>
            </motion.div>

            <h1
              className="mb-6"
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
              }}
            >
              <span className="text-[#16213E]">Every Video Is</span>
              <br />
              <span className="text-gradient">Unique — Prove It.</span>
            </h1>

            <p
              className="text-[#16213E]/70 mb-10 max-w-xl"
              style={{ fontSize: '1.25rem', lineHeight: 1.6, fontWeight: 400 }}
            >
              Protect your creative work with immutable blockchain verification.
              VeriVid creates a permanent, tamper-proof certificate of
              authenticity for every video.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to='/upload'>
              <Button
                className="bg-gradient-to-r from-[#A7E6FF] to-[#C6A0F6] text-[#16213E] hover:shadow-2xl hover:scale-105 transition-all glow-ice border-0 h-14 px-8"
                style={{ fontSize: '1.125rem', fontWeight: 600 }}
              >
                Verify a Video
              </Button></Link>
              <Link to='/check-auth'>
              <Button
                variant="outline"
                className="glass-card text-[#16213E] border-[#A7E6FF]/40 hover:bg-white/60 h-14 px-8"
                style={{ fontSize: '1.125rem', fontWeight: 600 }}
              >
                <Search className="mr-2 w-5 h-5" />
                Check Authenticity
              </Button></Link>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  label: 'Blockchain\nSecured',
                  color: '#A7E6FF',
                },
                { icon: Lock, label: 'Privacy\nProtected', color: '#C6A0F6' },
                {
                  icon: Globe,
                  label: 'Globally\nVerifiable',
                  color: '#A7E6FF',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-xl flex items-center justify-center mb-3 border border-white/40">
                    <item.icon
                      className="w-6 h-6"
                      style={{ color: item.color }}
                    />
                  </div>
                  <span
                    className="text-[#16213E]/70 whitespace-pre-line"
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      lineHeight: 1.4,
                    }}
                  >
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Main Card */}
            <div className="glass-card rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent shimmer-animation"></div>

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A7E6FF] to-[#C6A0F6] flex items-center justify-center glow-ice">
                      <CheckCircle
                        className="w-7 h-7 text-[#16213E]"
                        strokeWidth={2.5}
                      />
                    </div>
                    <div>
                      <div
                        className="text-[#16213E]"
                        style={{ fontSize: '0.875rem', fontWeight: 600 }}
                      >
                        Verification Status
                      </div>
                      <div
                        className="text-[#16213E]/60"
                        style={{ fontSize: '0.8125rem' }}
                      >
                        Certificate #2847
                      </div>
                    </div>
                  </div>
                  <div className="glass rounded-full px-4 py-2">
                    <span
                      className="text-green-600"
                      style={{ fontSize: '0.875rem', fontWeight: 700 }}
                    >
                      ✓ Verified
                    </span>
                  </div>
                </div>

                {/* Video Preview */}
                <div className="aspect-video bg-gradient-to-br from-[#C9D6DF] to-[#A7E6FF] rounded-2xl mb-6 flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#A7E6FF]/30 to-[#C6A0F6]/30"></div>
                  <div className="relative w-20 h-20 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center">
                    <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1"></div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/50 rounded-xl">
                    <span
                      className="text-[#16213E]/60"
                      style={{ fontSize: '0.875rem', fontWeight: 500 }}
                    >
                      Owner
                    </span>
                    <span
                      className="text-[#16213E] font-mono"
                      style={{ fontSize: '0.875rem', fontWeight: 600 }}
                    >
                      0x742d...f44e
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/50 rounded-xl">
                    <span
                      className="text-[#16213E]/60"
                      style={{ fontSize: '0.875rem', fontWeight: 500 }}
                    >
                      Verified
                    </span>
                    <span
                      className="text-[#16213E]"
                      style={{ fontSize: '0.875rem', fontWeight: 600 }}
                    >
                      Nov 3, 2025
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/50 rounded-xl">
                    <span
                      className="text-[#16213E]/60"
                      style={{ fontSize: '0.875rem', fontWeight: 500 }}
                    >
                      Blockchain
                    </span>
                    <span
                      className="text-[#16213E]"
                      style={{ fontSize: '0.875rem', fontWeight: 600 }}
                    >
                      Ethereum
                    </span>
                  </div>
                </div>

                {/* Badge */}
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-3 glow-lilac">
                    <Sparkles
                      className="w-5 h-5 text-[#C6A0F6]"
                      fill="#C6A0F6"
                    />
                    <span
                      className="text-gradient"
                      style={{ fontSize: '0.9375rem', fontWeight: 700 }}
                    >
                      VeriVid Certified
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-6 -left-6 glass-strong rounded-2xl p-4 shadow-xl"
            >
              <Upload className="w-8 h-8 text-[#A7E6FF]" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-6 -right-6 glass-strong rounded-2xl p-4 shadow-xl"
            >
              <Shield className="w-8 h-8 text-[#C6A0F6]" />
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 glass-strong rounded-2xl px-8 py-4 hidden xl:flex items-center gap-12"
        >
          {[
            { value: '10K+', label: 'Videos Verified' },
            { value: '5K+', label: 'Creators Protected' },
            { value: '100%', label: 'Immutable Proof' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div
                className="text-[#16213E]"
                style={{ fontSize: '1.5rem', fontWeight: 800 }}
              >
                {stat.value}
              </div>
              <div
                className="text-[#16213E]/60"
                style={{ fontSize: '0.875rem', fontWeight: 500 }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
