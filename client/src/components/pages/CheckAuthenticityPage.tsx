import { useState } from 'react';
import {
  Search,
  Upload,
  AlertTriangle,
  Calendar,
  User,
  Sparkles,
  Shield,
  FileVideo,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from '@tanstack/react-router';
import { apiService } from '../../services/api.service';

export interface Verified {
  title: string;
  owner: string;
  date: string;
  time: string;
  thumbnail: string;
  hash: string;
}

export function CheckAuthenticityPage() {
  const [searchType, setSearchType] = useState<'file' | 'link'>('link');
  const [searchValue, setSearchValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [searchResult, setSearchResult] = useState<
    'verified' | 'not-found' | null
  >(null);
  const [verifiedData, setVerifiedData] = useState<Verified | null>(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setIsScanning(true);
    setSearchResult(null);
    setVerifiedData(null);

    try {
      if (searchType === 'link') {
        const videoResponse = await apiService.getVideoDetails(searchValue);
        if (videoResponse.data && videoResponse.data.verified) {
          setVerifiedData({
            title: videoResponse.data.originalName,
            owner: videoResponse.data.uploaderId,
            date: new Date(videoResponse.data.createdAt).toLocaleDateString(
              'en-US',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }
            ),
            time: new Date(videoResponse.data.createdAt).toLocaleTimeString(
              'en-US'
            ),
            thumbnail: videoResponse.data.storageUrl || '/placeholder.svg',
            hash: videoResponse.data.sha256,
          });
          setSearchResult('verified');
        } else {
          setSearchResult('not-found');
        }
      } else {
        if (!searchValue) {
          alert('Please select a file');
          setIsScanning(false);
          return;
        }

        const files = (
          document.querySelector('input[type="file"]') as HTMLInputElement
        )?.files;
        if (!files || files.length === 0) {
          alert('No file selected');
          setIsScanning(false);
          return;
        }

        const file = files[0];
        const buffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const fileHash = hashArray
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');

        const verifyResponse = await apiService.verifyFileHash(fileHash);
        if (verifyResponse.data.verified && verifyResponse.data.video) {
          setVerifiedData({
            title: verifyResponse.data.video.originalName,
            owner: verifyResponse.data.video.uploaderId,
            date: new Date(
              verifyResponse.data.video.createdAt
            ).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            time: new Date(
              verifyResponse.data.video.createdAt
            ).toLocaleTimeString('en-US'),
            thumbnail:
              verifyResponse.data.video.storageUrl || '/placeholder.svg',
            hash: fileHash,
          });
          setSearchResult('verified');
        } else {
          setSearchResult('not-found');
        }
      }
    } catch (err) {
      console.error('[CheckAuth] Search failed:', err);
      setSearchResult('not-found');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 sm:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-6 py-3 mb-6">
            <Search className="w-5 h-5 text-[#C6A0F6]" />
            <span
              className="text-[#16213E]"
              style={{ fontSize: '0.9375rem', fontWeight: 600 }}
            >
              Authenticity Checker
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
            Check Video Authenticity
          </h1>
          <p
            className="text-[#16213E]/70 max-w-2xl mx-auto"
            style={{ fontSize: '1.0625rem', lineHeight: 1.6 }}
          >
            Verify if a video has been registered on the blockchain
          </p>
        </motion.div>

        {/* Main Search Interface */}
        <AnimatePresence mode="wait">
          {!isScanning && !searchResult && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              {/* Search Type Selector */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setSearchType('link')}
                  className={`relative group ${
                    searchType === 'link' ? 'glass-card' : 'glass'
                  } rounded-2xl p-6 transition-all`}
                >
                  {searchType === 'link' && (
                    <motion.div
                      layoutId="selector"
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#A7E6FF]/20 to-[#C6A0F6]/20 border-2 border-[#A7E6FF]"
                    />
                  )}
                  <div className="relative">
                    <Search
                      className={`w-8 h-8 mb-3 mx-auto ${searchType === 'link' ? 'text-[#A7E6FF]' : 'text-[#16213E]/40'}`}
                      strokeWidth={2}
                    />
                    <div
                      className="text-[#16213E]"
                      style={{ fontSize: '1rem', fontWeight: 600 }}
                    >
                      Paste Link
                    </div>
                    <div
                      className="text-[#16213E]/60 mt-1"
                      style={{ fontSize: '0.875rem' }}
                    >
                      URL or Hash
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSearchType('file')}
                  className={`relative group ${
                    searchType === 'file' ? 'glass-card' : 'glass'
                  } rounded-2xl p-6 transition-all`}
                >
                  {searchType === 'file' && (
                    <motion.div
                      layoutId="selector"
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#A7E6FF]/20 to-[#C6A0F6]/20 border-2 border-[#A7E6FF]"
                    />
                  )}
                  <div className="relative">
                    <Upload
                      className={`w-8 h-8 mb-3 mx-auto ${searchType === 'file' ? 'text-[#C6A0F6]' : 'text-[#16213E]/40'}`}
                      strokeWidth={2}
                    />
                    <div
                      className="text-[#16213E]"
                      style={{ fontSize: '1rem', fontWeight: 600 }}
                    >
                      Upload File
                    </div>
                    <div
                      className="text-[#16213E]/60 mt-1"
                      style={{ fontSize: '0.875rem' }}
                    >
                      Direct Scan
                    </div>
                  </div>
                </button>
              </div>

              {/* Input Area */}
              <motion.div layout className="glass-card rounded-2xl p-8 mb-6">
                {searchType === 'link' ? (
                  <div>
                    <label
                      className="block text-[#16213E] mb-3"
                      style={{ fontSize: '0.9375rem', fontWeight: 600 }}
                    >
                      Enter Video URL or Blockchain Hash
                    </label>
                    <Input
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="https://youtube.com/watch?v=... or 0x..."
                      className="glass-card border-[#A7E6FF]/40 text-[#16213E] h-14 px-5 rounded-xl"
                      style={{ fontSize: '0.9375rem' }}
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-[#A7E6FF]/40 rounded-2xl p-12 text-center hover:border-[#A7E6FF] hover:bg-[#A7E6FF]/5 transition-all cursor-pointer relative group">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSearchValue(e.target.files[0].name);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <FileVideo
                      className="w-12 h-12 text-[#A7E6FF] mx-auto mb-4 group-hover:scale-110 transition-transform"
                      strokeWidth={1.5}
                    />
                    <div
                      className="text-[#16213E] mb-1"
                      style={{ fontSize: '1rem', fontWeight: 600 }}
                    >
                      Drop video here or click to browse
                    </div>
                    <div
                      className="text-[#16213E]/60"
                      style={{ fontSize: '0.875rem' }}
                    >
                      MP4, MOV, AVI • Max 500MB
                    </div>
                  </div>
                )}
              </motion.div>

              <Button
                onClick={handleSearch}
                disabled={searchType === 'link' && !searchValue}
                className="w-full bg-gradient-to-r from-[#A7E6FF] to-[#C6A0F6] text-[#16213E] hover:shadow-xl transition-all glow-ice border-0 h-14 disabled:opacity-40"
                style={{ fontSize: '1rem', fontWeight: 600 }}
              >
                <Search className="w-5 h-5 mr-2" />
                Check Authenticity
              </Button>
            </motion.div>
          )}

          {/* Scanning State */}
          {isScanning && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto"
            >
              <div className="glass-card rounded-2xl p-12 text-center">
                {/* Animated Icon */}
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
                        stroke="url(#gradient-check)"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="164 56"
                      />
                      <defs>
                        <linearGradient
                          id="gradient-check"
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
                    <Search
                      className="w-8 h-8 text-[#16213E]"
                      strokeWidth={2}
                    />
                  </div>
                </div>

                <h3
                  className="text-[#16213E] mb-2"
                  style={{ fontSize: '1.25rem', fontWeight: 700 }}
                >
                  Scanning Blockchain
                </h3>
                <p
                  className="text-[#16213E]/60"
                  style={{ fontSize: '0.9375rem' }}
                >
                  Checking for verification records...
                </p>
              </div>
            </motion.div>
          )}

          {/* Verified Result */}
          {searchResult === 'verified' && (
            <motion.div
              key="verified"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="glass-card rounded-2xl p-8 mb-6">
                <div className="flex items-start gap-5 mb-6">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#A7E6FF] to-[#C6A0F6] flex items-center justify-center flex-shrink-0 shadow-lg glow-ice">
                      <Sparkles
                        className="w-7 h-7 text-[#16213E]"
                        strokeWidth={2}
                        fill="#16213E"
                      />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-[#A7E6FF] to-[#C6A0F6] flex items-center justify-center shadow-md border-2 border-white">
                      <Shield
                        className="w-3.5 h-3.5 text-[#16213E]"
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-[#16213E] mb-2"
                      style={{ fontSize: '1.5rem', fontWeight: 700 }}
                    >
                      Verified Authentic
                    </h3>
                    <p
                      className="text-[#16213E]/70"
                      style={{ fontSize: '0.9375rem' }}
                    >
                      This video has been verified on the blockchain
                    </p>
                  </div>
                </div>

                {verifiedData && (
                  <div className="glass rounded-2xl overflow-hidden mb-6">
                    <div className="aspect-video bg-gradient-to-br from-[#C9D6DF] to-[#A7E6FF] relative">
                      <img
                        src={verifiedData.thumbnail || '/placeholder.svg'}
                        alt={verifiedData.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h4
                        className="text-[#16213E] mb-4"
                        style={{ fontSize: '1.125rem', fontWeight: 700 }}
                      >
                        {verifiedData.title}
                      </h4>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-white/60 rounded-xl">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#A7E6FF]/30 to-[#C6A0F6]/30 flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-[#16213E]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div
                              className="text-[#16213E]/60 mb-1"
                              style={{ fontSize: '0.8125rem', fontWeight: 500 }}
                            >
                              Owner
                            </div>
                            <div
                              className="text-[#16213E] font-mono truncate"
                              style={{ fontSize: '0.875rem', fontWeight: 600 }}
                            >
                              {verifiedData.owner}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-white/60 rounded-xl">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#A7E6FF]/30 to-[#C6A0F6]/30 flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-5 h-5 text-[#16213E]" />
                          </div>
                          <div>
                            <div
                              className="text-[#16213E]/60 mb-1"
                              style={{ fontSize: '0.8125rem', fontWeight: 500 }}
                            >
                              Verified on
                            </div>
                            <div
                              className="text-[#16213E]"
                              style={{ fontSize: '0.875rem', fontWeight: 600 }}
                            >
                              {verifiedData.date}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-gradient-to-r from-[#A7E6FF] to-[#C6A0F6] text-[#16213E] hover:shadow-xl transition-all glow-ice border-0 h-12"
                    style={{ fontSize: '0.9375rem', fontWeight: 600 }}
                  >
                    <Sparkles className="mr-2 w-4 h-4" />
                    View Certificate
                  </Button>
                  <Button
                    onClick={() => {
                      setSearchResult(null);
                      setSearchValue('');
                      setVerifiedData(null);
                    }}
                    variant="outline"
                    className="flex-1 glass text-[#16213E] border-[#A7E6FF]/40 hover:bg-white/60 h-12"
                    style={{ fontSize: '0.9375rem', fontWeight: 600 }}
                  >
                    Check Another
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Not Verified Result */}
          {searchResult === 'not-found' && (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="glass-card rounded-2xl p-8">
                <div className="flex items-start gap-5 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C6A0F6] to-[#A7E6FF] flex items-center justify-center flex-shrink-0 glow-lilac shadow-lg">
                    <AlertTriangle
                      className="w-7 h-7 text-[#16213E]"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-[#16213E] mb-2"
                      style={{ fontSize: '1.5rem', fontWeight: 700 }}
                    >
                      Not Verified
                    </h3>
                    <p
                      className="text-[#16213E]/70"
                      style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}
                    >
                      This video has not been verified on the blockchain yet. Be
                      the first to verify it.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => navigate({ to: '/upload' })}
                    className="flex-1 bg-gradient-to-r from-[#A7E6FF] to-[#C6A0F6] text-[#16213E] hover:shadow-xl transition-all glow-ice border-0 h-12"
                    style={{ fontSize: '0.9375rem', fontWeight: 600 }}
                  >
                    Verify This Video
                  </Button>
                  <Button
                    onClick={() => {
                      setSearchResult(null);
                      setSearchValue('');
                      setVerifiedData(null);
                    }}
                    variant="outline"
                    className="flex-1 glass text-[#16213E] border-[#A7E6FF]/40 hover:bg-white/60 h-12"
                    style={{ fontSize: '0.9375rem', fontWeight: 600 }}
                  >
                    Check Another
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
