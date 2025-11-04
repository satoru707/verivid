import { useState } from 'react';
import { Upload, FileVideo, Sparkles, Shield, Lock, Globe } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadPageProps {
  onVerificationComplete: (videoId: string) => void;
}

export function UploadPage({ onVerificationComplete }: UploadPageProps) {
  const [step, setStep] = useState<
    'upload' | 'details' | 'verifying' | 'complete'
  >('upload');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [externalLink, setExternalLink] = useState('');

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setStep('details');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStep('details');
    }
  };

  const handleVerify = () => {
    setStep('verifying');
    setTimeout(() => setStep('complete'), 2500);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Step 1: Upload */}
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 glass rounded-full px-6 py-3 mb-6">
                  <Upload className="w-5 h-5 text-[#C6A0F6]" />
                  <span
                    className="text-[#16213E]"
                    style={{ fontSize: '0.9375rem', fontWeight: 600 }}
                  >
                    Verify Video
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
                  Protect Your Creation
                </h1>
                <p
                  className="text-[#16213E]/70 max-w-2xl mx-auto"
                  style={{ fontSize: '1.0625rem', lineHeight: 1.6 }}
                >
                  Upload your video to create permanent, blockchain-verified
                  proof of ownership
                </p>
              </div>

              <div className="max-w-3xl mx-auto">
                <div
                  onDragEnter={(e) => e.preventDefault()}
                  onDragLeave={(e) => e.preventDefault()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="relative glass-card rounded-2xl p-16 text-center border-2 border-dashed border-[#A7E6FF]/40 hover:border-[#A7E6FF] hover:bg-[#A7E6FF]/5 transition-all cursor-pointer group mb-8"
                >
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <FileVideo
                    className="w-16 h-16 text-[#A7E6FF] mx-auto mb-6 group-hover:scale-110 transition-transform"
                    strokeWidth={1.5}
                  />

                  <div
                    className="text-[#16213E] mb-2"
                    style={{ fontSize: '1.125rem', fontWeight: 700 }}
                  >
                    Drop your video here
                  </div>
                  <div
                    className="text-[#16213E]/60 mb-6"
                    style={{ fontSize: '0.9375rem' }}
                  >
                    or click to browse • MP4, MOV, AVI • Max 500MB
                  </div>

                  <div className="inline-flex items-center gap-2 glass rounded-full px-6 py-2.5">
                    <Lock className="w-4 h-4 text-[#C6A0F6]" />
                    <span
                      className="text-[#16213E]"
                      style={{ fontSize: '0.875rem', fontWeight: 600 }}
                    >
                      Processed securely
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      icon: Shield,
                      label: 'Blockchain Security',
                      desc: 'Immutable proof',
                    },
                    {
                      icon: Lock,
                      label: 'Privacy First',
                      desc: 'Hash only, no upload',
                    },
                    {
                      icon: Globe,
                      label: 'Global Verification',
                      desc: 'Anyone can verify',
                    },
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="glass-card rounded-xl p-5 text-center"
                    >
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#A7E6FF]/30 to-[#C6A0F6]/30 mb-3">
                        <feature.icon
                          className="w-5 h-5 text-[#16213E]"
                          strokeWidth={2}
                        />
                      </div>
                      <div
                        className="text-[#16213E] mb-1"
                        style={{ fontSize: '0.9375rem', fontWeight: 600 }}
                      >
                        {feature.label}
                      </div>
                      <div
                        className="text-[#16213E]/60"
                        style={{ fontSize: '0.8125rem' }}
                      >
                        {feature.desc}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Details */}
          {step === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="mb-8">
                <h2
                  className="text-[#16213E] mb-2"
                  style={{ fontSize: '1.75rem', fontWeight: 800 }}
                >
                  Add Video Details
                </h2>
                <p
                  className="text-[#16213E]/70"
                  style={{ fontSize: '0.9375rem' }}
                >
                  These details will be stored with your blockchain certificate
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: File Preview */}
                <div className="glass-card rounded-2xl p-6">
                  <div className="aspect-video bg-gradient-to-br from-[#C9D6DF] to-[#A7E6FF] rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#A7E6FF]/30 to-[#C6A0F6]/30"></div>
                    <div className="relative">
                      <FileVideo
                        className="w-12 h-12 text-white/80"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                  <div
                    className="text-[#16213E] mb-1"
                    style={{ fontSize: '0.9375rem', fontWeight: 600 }}
                  >
                    {file?.name}
                  </div>
                  <div
                    className="flex items-center gap-3 text-[#16213E]/60"
                    style={{ fontSize: '0.8125rem' }}
                  >
                    <span>
                      {file ? (file.size / 1024 / 1024).toFixed(2) : '0'} MB
                    </span>
                    <span>•</span>
                    <span>{file?.type || 'video/mp4'}</span>
                  </div>
                </div>

                {/* Right: Form */}
                <div className="space-y-5">
                  <div>
                    <label
                      className="block text-[#16213E] mb-2"
                      style={{ fontSize: '0.9375rem', fontWeight: 600 }}
                    >
                      Video Title *
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Give your video a title"
                      className="glass-card border-[#A7E6FF]/30 text-[#16213E] h-12 px-5 rounded-xl"
                      style={{ fontSize: '0.9375rem' }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-[#16213E] mb-2"
                      style={{ fontSize: '0.9375rem', fontWeight: 600 }}
                    >
                      Description (Optional)
                    </label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your video..."
                      className="glass-card border-[#A7E6FF]/30 text-[#16213E] min-h-24 p-4 rounded-xl resize-none"
                      style={{ fontSize: '0.9375rem' }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-[#16213E] mb-2"
                      style={{ fontSize: '0.9375rem', fontWeight: 600 }}
                    >
                      External Link (Optional)
                    </label>
                    <Input
                      value={externalLink}
                      onChange={(e) => setExternalLink(e.target.value)}
                      placeholder="https://..."
                      className="glass-card border-[#A7E6FF]/30 text-[#16213E] h-12 px-5 rounded-xl"
                      style={{ fontSize: '0.9375rem' }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <Button
                  onClick={() => setStep('upload')}
                  variant="outline"
                  className="flex-1 glass text-[#16213E] border-[#A7E6FF]/40 hover:bg-white/60 h-12"
                  style={{ fontSize: '0.9375rem', fontWeight: 600 }}
                >
                  Back
                </Button>
                <Button
                  onClick={handleVerify}
                  disabled={!title}
                  className="flex-1 bg-gradient-to-r from-[#A7E6FF] to-[#C6A0F6] text-[#16213E] hover:shadow-xl transition-all glow-ice border-0 h-12"
                  style={{ fontSize: '0.9375rem', fontWeight: 600 }}
                >
                  Verify on Blockchain
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Verifying */}
          {step === 'verifying' && (
            <motion.div
              key="verifying"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto"
            >
              <div className="glass-card rounded-2xl p-12 text-center">
                {/* Animated Icon */}
                <div className="relative inline-flex items-center justify-center mb-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="w-20 h-20"
                  >
                    <svg className="w-20 h-20" viewBox="0 0 80 80">
                      <circle
                        cx="40"
                        cy="40"
                        r="35"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="164 56"
                      />
                      <defs>
                        <linearGradient
                          id="gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#A7E6FF" />
                          <stop offset="100%" stopColor="#C6A0F6" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </motion.div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Shield
                      className="w-8 h-8 text-[#16213E]"
                      strokeWidth={2}
                    />
                  </div>
                </div>

                <h3
                  className="text-[#16213E] mb-2"
                  style={{ fontSize: '1.25rem', fontWeight: 700 }}
                >
                  Creating Certificate
                </h3>
                <p
                  className="text-[#16213E]/60"
                  style={{ fontSize: '0.9375rem' }}
                >
                  Verifying on blockchain...
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 4: Complete */}
          {step === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto"
            >
              <div className="glass-card rounded-2xl p-10 text-center">
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="relative inline-flex items-center justify-center mb-6"
                >
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#A7E6FF] to-[#C6A0F6] flex items-center justify-center shadow-xl glow-ice">
                    <Sparkles
                      className="w-10 h-10 text-[#16213E]"
                      strokeWidth={2}
                      fill="#16213E"
                    />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-[#A7E6FF] to-[#C6A0F6] flex items-center justify-center shadow-lg border-2 border-white"
                  >
                    <Shield
                      className="w-4 h-4 text-[#16213E]"
                      strokeWidth={2.5}
                    />
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2
                    className="text-[#16213E] mb-3"
                    style={{ fontSize: '1.75rem', fontWeight: 800 }}
                  >
                    Video Verified!
                  </h2>
                  <p
                    className="text-[#16213E]/70 mb-8 max-w-sm mx-auto"
                    style={{ fontSize: '1rem', lineHeight: 1.6 }}
                  >
                    Your video is now protected by blockchain verification. Your
                    certificate is ready to view.
                  </p>

                  <Button
                    onClick={() => onVerificationComplete('video-123')}
                    className="bg-gradient-to-r from-[#A7E6FF] to-[#C6A0F6] text-[#16213E] hover:shadow-xl transition-all glow-ice border-0 h-12 px-8"
                    style={{ fontSize: '1rem', fontWeight: 600 }}
                  >
                    View Certificate
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
