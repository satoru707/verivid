import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../context/use-wallet';

interface EmailRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmailRecoveryModal({
  isOpen,
  onClose,
}: EmailRecoveryModalProps) {
  const { userProfile } = useWallet();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'input' | 'sending' | 'sent'>('input');

  const handleSendRecovery = () => {
    if (!email) return;

    setStep('sending');

    setTimeout(() => {
      setStep('sent');
    }, 1500);
  };

  const handleClose = () => {
    if (step !== 'sending') {
      onClose();
      setTimeout(() => {
        setStep('input');
        setEmail('');
      }, 300);
    }
  };

  const handleReturnHome = () => {
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass-card border-[#A7E6FF]/40 max-w-md p-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8"
            >
              <DialogHeader className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#A7E6FF] to-[#C6A0F6] flex items-center justify-center glow-ice">
                    <Mail className="w-6 h-6 text-[#16213E]" strokeWidth={2} />
                  </div>
                  <DialogTitle
                    className="text-[#16213E]"
                    style={{ fontSize: '1.5rem', fontWeight: 700 }}
                  >
                    Recover Access
                  </DialogTitle>
                </div>
                <p
                  className="text-[#16213E]/70"
                  style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}
                >
                  We'll send you a secure link to restore access to your VeriVid
                  account.
                </p>
              </DialogHeader>

              <div className="space-y-5">
                <div>
                  <label
                    className="block text-[#16213E] mb-2"
                    style={{ fontSize: '0.9375rem', fontWeight: 600 }}
                  >
                    Registered Email Address
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={userProfile.email || 'your@email.com'}
                    className="glass-card border-[#A7E6FF]/30 text-[#16213E] h-12 px-5 rounded-xl"
                    style={{ fontSize: '0.9375rem' }}
                  />
                </div>

                <div className="p-4 glass rounded-xl">
                  <div
                    className="text-[#16213E]/70"
                    style={{ fontSize: '0.875rem', lineHeight: 1.5 }}
                  >
                    The recovery link will allow you to reconnect your wallet
                    and access your account.
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1 glass text-[#16213E] border-[#A7E6FF]/40 hover:bg-white/60 h-12"
                  style={{ fontSize: '0.9375rem', fontWeight: 600 }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendRecovery}
                  disabled={!email}
                  className="flex-1 bg-gradient-to-r from-[#A7E6FF] to-[#C6A0F6] text-[#16213E] hover:shadow-xl transition-all glow-ice border-0 h-12 disabled:opacity-40"
                  style={{ fontSize: '0.9375rem', fontWeight: 600 }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Recovery Link
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'sending' && (
            <motion.div
              key="sending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-12 text-center"
            >
              <div className="relative inline-flex items-center justify-center mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="w-20 h-20"
                >
                  <svg className="w-20 h-20" viewBox="0 0 80 80">
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="url(#gradient-recovery)"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="164 56"
                    />
                    <defs>
                      <linearGradient
                        id="gradient-recovery"
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
                  <Send className="w-8 h-8 text-[#16213E]" strokeWidth={2} />
                </div>
              </div>

              <h3
                className="text-[#16213E] mb-2"
                style={{ fontSize: '1.25rem', fontWeight: 700 }}
              >
                Sending Recovery Link
              </h3>
              <p
                className="text-[#16213E]/60"
                style={{ fontSize: '0.9375rem' }}
              >
                Please wait...
              </p>
            </motion.div>
          )}

          {step === 'sent' && (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#A7E6FF] to-[#C6A0F6] mb-6 glow-ice"
              >
                <CheckCircle2
                  className="w-10 h-10 text-[#16213E]"
                  strokeWidth={2.5}
                />
              </motion.div>

              <h3
                className="text-[#16213E] mb-3"
                style={{ fontSize: '1.5rem', fontWeight: 700 }}
              >
                Email Sent!
              </h3>
              <p
                className="text-[#16213E]/70 mb-8 max-w-sm mx-auto"
                style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}
              >
                We've sent a recovery link to{' '}
                <span className="text-[#16213E]" style={{ fontWeight: 600 }}>
                  {email}
                </span>
                . Check your inbox and follow the instructions.
              </p>

              <Button
                onClick={handleReturnHome}
                className="bg-gradient-to-r from-[#A7E6FF] to-[#C6A0F6] text-[#16213E] hover:shadow-xl transition-all glow-ice border-0 h-12 px-8"
                style={{ fontSize: '0.9375rem', fontWeight: 600 }}
              >
                Return Home
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
