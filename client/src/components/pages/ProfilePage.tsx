// src/components/pages/ProfilePage.tsx
import { useEffect, useState } from 'react';
import { Calendar, Shield, Flag, Sparkles, LogOut, X } from 'lucide-react';
import { VideoCard } from '../VideoCard';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { motion } from 'framer-motion';
import { useNavigate } from '@tanstack/react-router';
import { useWallet } from '../../context/use-wallet';
import { apiService } from '../../services/api.service';
import { ConflictPage } from './ConflictPage'; // Import as-is

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  date: string;
  verified: boolean;
}

interface ProfileProps {
  address: string;
  memberSince: string;
  username?: string;
  bio?: string;
}

interface ConflictData {
  originalVerification: {
    title: string;
    owner: string;
    timestamp: string;
    blockchainHash: string;
    thumbnail: string;
  };
  conflictingUpload: {
    title: string;
    owner: string;
    timestamp: string;
    blockchainHash: string;
    thumbnail: string;
  };
}

export function ProfilePage() {
  const navigate = useNavigate();
  const {
    walletAddress,
    disconnectWallet,
    isLoading: authLoading,
  } = useWallet();
  const [profile, setProfile] = useState<ProfileProps | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConflict, setShowConflict] = useState(false);
  const [conflictData, setConflictData] = useState<ConflictData | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (walletAddress) {
          const userResponse = await apiService.getCurrentUser();
          if (userResponse.data) {
            setProfile({
              address: userResponse.data.wallet,
              memberSince: userResponse.data
                ? new Date(userResponse.data.createdAt).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                    }
                  )
                : 'Recently',
              username: userResponse.data.username,
              bio: userResponse.data.bio || undefined,
            });

            const videosResponse = await apiService.listVideos();
            if (videosResponse.data) {
              setVideos(
                videosResponse.data.map((v) => ({
                  id: v.id,
                  title: v.originalName,
                  thumbnail: v.storageUrl || '/video-production-setup.png',
                  date: v.verifiedAt
                    ? new Date(v.verifiedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : new Date(v.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }),
                  verified: v.verified,
                }))
              );
            }
          }
        }
      } catch (err) {
        console.error('[Profile] Load error:', err);
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [walletAddress]);

  const handleReportDuplicate = () => {
    if (videos.length === 0) return;

    const firstVideo = videos[0];
    setConflictData({
      originalVerification: {
        title: firstVideo.title,
        owner: walletAddress!,
        timestamp: firstVideo.date,
        blockchainHash: '0x' + Math.random().toString(16).slice(2),
        thumbnail: firstVideo.thumbnail,
      },
      conflictingUpload: {
        title: firstVideo.title + ' (Duplicate)',
        owner: '0x' + Math.random().toString(16).slice(2),
        timestamp: new Date().toLocaleDateString(),
        blockchainHash: '0x' + Math.random().toString(16).slice(2),
        thumbnail: firstVideo.thumbnail,
      },
    });
    setShowConflict(true);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 sm:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'linear',
              }}
              className="w-12 h-12"
            >
              <Sparkles className="w-12 h-12 text-[#A7E6FF]" />
            </motion.div>
          </div>
          <p className="mt-4 text-[#16213E]/70">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile || !walletAddress) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 sm:px-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#16213E] text-lg mb-4">
            {error || 'Please connect your wallet first'}
          </p>
          <Button
            onClick={() => navigate({ to: '/' })}
            className="bg-gradient-to-r from-[#A7E6FF] to-[#C6A0F6] text-[#16213E] hover:shadow-xl transition-all glow-ice border-0 h-12 px-8"
          >
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  const verifiedCount = videos.filter((v) => v.verified).length;

  return (
    <>
      {/* Profile Page */}
      <div className="min-h-screen pt-32 pb-20 px-6 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-8 mb-10"
          >
            <div className="flex flex-col md:flex-row items-start gap-6">
              <Avatar className="w-20 h-20 border-2 border-[#A7E6FF]/40 shadow-lg">
                <AvatarFallback
                  className="bg-gradient-to-br from-[#A7E6FF] to-[#C6A0F6] text-[#16213E]"
                  style={{ fontSize: '1.5rem', fontWeight: 700 }}
                >
                  {profile.address?.slice(2, 4).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h2
                    className="text-[#16213E]"
                    style={{ fontSize: '1.5rem', fontWeight: 800 }}
                  >
                    {profile.username || profile.address}
                  </h2>
                  <div className="glass rounded-full px-4 py-1.5">
                    <span
                      className="text-[#A7E6FF]"
                      style={{ fontSize: '0.8125rem', fontWeight: 700 }}
                    >
                      Creator
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 mb-4">
                  <div className="flex items-center gap-2 text-[#16213E]/70">
                    <Calendar className="w-4 h-4" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      Member since {profile.memberSince}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#16213E]/70">
                    <Shield className="w-4 h-4" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      {verifiedCount} verified{' '}
                      {verifiedCount === 1 ? 'video' : 'videos'}
                    </span>
                  </div>
                </div>

                {profile.bio && (
                  <p
                    className="text-[#16213E]/70 max-w-2xl"
                    style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}
                  >
                    {profile.bio}
                  </p>
                )}
              </div>

              <Button
                onClick={async () => {
                  await disconnectWallet();
                  navigate({ to: '/' });
                }}
                variant="outline"
                className="glass text-red-600 border-red-200 hover:bg-red-50 h-12 px-6"
                style={{ fontSize: '0.875rem', fontWeight: 600 }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#A7E6FF]" />
                <h3
                  className="text-[#16213E]"
                  style={{ fontSize: '1.25rem', fontWeight: 700 }}
                >
                  Verified Videos
                </h3>
              </div>
              <div className="glass rounded-full px-5 py-2">
                <span
                  className="text-[#16213E]/70"
                  style={{ fontSize: '0.875rem', fontWeight: 600 }}
                >
                  {videos.length} total
                </span>
              </div>
            </div>

            {videos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#16213E]/70 mb-4">No videos verified yet</p>
                <Button
                  onClick={() => navigate({ to: '/upload' })}
                  className="bg-gradient-to-r from-[#A7E6FF] to-[#C6A0F6] text-[#16213E] hover:shadow-xl transition-all glow-ice border-0 h-12 px-8"
                >
                  Verify Your First Video
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {videos.map((video, i) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    <VideoCard
                      {...video}
                      onClick={() =>
                        navigate({ to: `/certificate/${video.id}` })
                      }
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Report Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 text-center"
          >
            <Button
              onClick={handleReportDuplicate}
              variant="outline"
              className="glass-card text-[#16213E] border-[#A7E6FF]/40 hover:bg-white/60 h-12 px-6 bg-transparent"
              style={{ fontSize: '0.9375rem', fontWeight: 600 }}
            >
              <Flag className="w-4 h-4 mr-2" />
              Report Duplicate Content
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Full-Screen Modal – uses your original ConflictPage */}
      {showConflict && conflictData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowConflict(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto glass-card rounded-2xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowConflict(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5 text-[#16213E]" />
            </button>

            {/* Your original ConflictPage content */}
            <ConflictPage conflict={conflictData} />
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
