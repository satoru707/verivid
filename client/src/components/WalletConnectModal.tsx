import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Wallet,
  Sparkles,
  Shield,
  CheckCircle2,
  Mail,
  Send,
  ArrowLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../context/use-wallet';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletConnectModal({
  isOpen,
  onClose,
}: WalletConnectModalProps) {
  const { connectWallet } = useWallet();
  const [step, setStep] = useState<
    | 'select'
    | 'signing'
    | 'success'
    | 'recovery'
    | 'recovery-sending'
    | 'recovery-sent'
  >('select');
  const [recoveryEmail, setRecoveryEmail] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('select');
      setRecoveryEmail('');
    }
  }, [isOpen]);

  const handleConnectMetaMask = () => {
    setStep('signing');
    (async () => {
      console.log('1');
      try {
        const address = await connectWallet();
        console.log('2', address);
        if (address) {
          setStep('success');
          setTimeout(() => onClose(), 1500);
        } else {
          setStep('select');
        }
      } catch (e: unknown) {
        console.error('[WalletModal] Connect failed:', e);
        setStep('select');
      }
    })();
  };

  const handleRecoveryClick = () => {
    setStep('recovery');
  };

  const handleBackToSelect = () => {
    setStep('select');
    setRecoveryEmail('');
  };

  const handleSendRecovery = () => {
    if (!recoveryEmail) return;

    setStep('recovery-sending');

    setTimeout(() => {
      setStep('recovery-sent');
    }, 1500);
  };

  const handleReturnHome = () => {
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && step !== 'signing' && step !== 'recovery-sending') {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="glass-card border-[#A7E6FF]/40 max-w-md p-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8"
            >
              <DialogHeader className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#A7E6FF] to-[#C6A0F6] flex items-center justify-center glow-ice">
                    <Wallet
                      className="w-6 h-6 text-[#16213E]"
                      strokeWidth={2}
                    />
                  </div>
                  <DialogTitle
                    className="text-[#16213E]"
                    style={{ fontSize: '1.5rem', fontWeight: 700 }}
                  >
                    Connect Wallet
                  </DialogTitle>
                </div>
                <p
                  className="text-[#16213E]/70"
                  style={{ fontSize: '0.9375rem' }}
                >
                  Connect your MetaMask wallet to get started
                </p>
              </DialogHeader>

              <div className="space-y-3 mb-6">
                <button
                  type="button"
                  onClick={handleConnectMetaMask}
                  className="w-full glass rounded-xl p-5 flex items-center gap-4 hover:bg-white/60 transition-all group text-left"
                >
                  <div className="text-3xl">🦊</div>
                  <div className="flex-1">
                    <div
                      className="text-[#16213E] mb-1 group-hover:text-[#A7E6FF] transition-colors"
                      style={{ fontSize: '1rem', fontWeight: 600 }}
                    >
                      MetaMask
                    </div>
                    <div
                      className="text-[#16213E]/60"
                      style={{ fontSize: '0.875rem' }}
                    >
                      Desktop browser or mobile app with QR scan
                    </div>
                  </div>
                </button>
              </div>

              <div className="pt-4 border-t border-[#A7E6FF]/20">
                <button
                  type="button"
                  onClick={handleRecoveryClick}
                  className="w-full text-center text-[#16213E] hover:text-[#C6A0F6] transition-colors"
                  style={{ fontSize: '0.9375rem', fontWeight: 600 }}
                >
                  Lost access? Recover your account →
                </button>
              </div>

              <div className="mt-6 p-4 glass rounded-xl flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#C6A0F6] flex-shrink-0 mt-0.5" />
                <div
                  className="text-[#16213E]/70"
                  style={{ fontSize: '0.875rem', lineHeight: 1.5 }}
                >
                  Your wallet will be used to sign transactions and verify your
                  identity on the blockchain.
                </div>
              </div>
            </motion.div>
          )}

          {step === 'signing' && (
            <motion.div
              key="signing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-12 text-center"
            >
              <div className="relative inline-flex items-center justify-center mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'linear',
                  }}
                  className="w-20 h-20"
                >
                  <svg className="w-20 h-20" viewBox="0 0 80 80">
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="url(#gradient-wallet)"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="164 56"
                    />
                    <defs>
                      <linearGradient
                        id="gradient-wallet"
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
                  <Sparkles
                    className="w-8 h-8 text-[#16213E]"
                    strokeWidth={2}
                  />
                </div>
              </div>

              <h3
                className="text-[#16213E] mb-2"
                style={{ fontSize: '1.25rem', fontWeight: 700 }}
              >
                Waiting for Signature
              </h3>
              <p
                className="text-[#16213E]/60"
                style={{ fontSize: '0.9375rem' }}
              >
                Confirm the connection in your MetaMask wallet...
              </p>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="p-12 text-center"
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
                className="text-[#16213E] mb-2"
                style={{ fontSize: '1.25rem', fontWeight: 700 }}
              >
                Wallet Connected!
              </h3>
              <p
                className="text-[#16213E]/60"
                style={{ fontSize: '0.9375rem' }}
              >
                You're all set to verify videos
              </p>
            </motion.div>
          )}

          {step === 'recovery' && (
            <motion.div
              key="recovery"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8"
            >
              <button
                type="button"
                onClick={handleBackToSelect}
                className="flex items-center gap-2 text-[#16213E]/60 hover:text-[#16213E] transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  Back
                </span>
              </button>

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
                  Enter your registered email to receive a secure recovery link
                </p>
              </DialogHeader>

              <div className="space-y-5">
                <div>
                  <label
                    className="block text-[#16213E] mb-2"
                    style={{ fontSize: '0.9375rem', fontWeight: 600 }}
                  >
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="your@email.com"
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
                    and restore access to your account.
                  </div>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleSendRecovery}
                disabled={!recoveryEmail}
                className="w-full mt-6 bg-gradient-to-r from-[#A7E6FF] to-[#C6A0F6] text-[#16213E] hover:shadow-xl transition-all glow-ice border-0 h-12 disabled:opacity-40"
                style={{ fontSize: '0.9375rem', fontWeight: 600 }}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Recovery Link
              </Button>
            </motion.div>
          )}

          {step === 'recovery-sending' && (
            <motion.div
              key="recovery-sending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-12 text-center"
            >
              <div className="relative inline-flex items-center justify-center mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'linear',
                  }}
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

          {step === 'recovery-sent' && (
            <motion.div
              key="recovery-sent"
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
                  {recoveryEmail}
                </span>
                . Check your inbox and follow the instructions.
              </p>

              <Button
                type="button"
                onClick={handleReturnHome}
                className="bg-gradient-to-r from-[#A7E6FF] to-[#C6A0F6] text-[#16213E] hover:shadow-xl transition-all glow-ice border-0 h-12 px-8"
                style={{ fontSize: '0.9375rem', fontWeight: 600 }}
              >
                Close
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
