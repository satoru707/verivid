/**
 * Complete rewrite to fetch real user data and integrate with auth system
 */
import { useEffect, useState } from 'react';
import { Calendar, Shield, Flag, Sparkles, LogOut } from 'lucide-react';
import { VideoCard } from '../VideoCard';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { motion } from 'framer-motion';
import { useNavigate } from '@tanstack/react-router';
import { useWallet } from '../../context/use-wallet';
import { apiService } from '../../services/api.service';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  date: string;
  verified: boolean;
}

interface Conflict {
  id: string;
  title: string;
  status: 'resolved' | 'pending';
  date: string;
}

export function ProfilePage() {
  const navigate = useNavigate();
  const {
    walletAddress,
    disconnectWallet,
    isLoading: authLoading,
  } = useWallet();
  const [profile, setProfile] = useState<any>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (walletAddress) {
          const userResponse = await apiService.getCurrentUser();
          if (userResponse.user) {
            setProfile({
              address: userResponse.user.wallet,
              memberSince: userResponse.user.createdAt
                ? new Date(userResponse.user.createdAt).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                    }
                  )
                : 'Recently',
              username: userResponse.user.username,
              bio: userResponse.user.bio,
            });

            const videosResponse = await apiService.listVideos();
            if (videosResponse.videos) {
              setVideos(
                videosResponse.videos.map((v: any) => ({
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
                    onClick={() => navigate({ to: `/certificate/${video.id}` })}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {conflicts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Flag className="w-5 h-5 text-[#16213E]" />
              <h3
                className="text-[#16213E]"
                style={{ fontSize: '1.25rem', fontWeight: 700 }}
              >
                Conflict History
              </h3>
            </div>

            <div className="space-y-3">
              {conflicts.map((conflict) => (
                <div key={conflict.id} className="glass-card rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4
                          className="text-[#16213E]"
                          style={{ fontSize: '1rem', fontWeight: 600 }}
                        >
                          {conflict.title}
                        </h4>
                        <span
                          className={`px-3 py-1 rounded-full ${
                            conflict.status === 'resolved'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                          style={{ fontSize: '0.8125rem', fontWeight: 700 }}
                        >
                          {conflict.status === 'resolved'
                            ? 'Resolved'
                            : 'Pending'}
                        </span>
                      </div>
                      <p
                        className="text-[#16213E]/60"
                        style={{ fontSize: '0.875rem' }}
                      >
                        {conflict.date}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="glass text-[#16213E] border-[#A7E6FF]/40 hover:bg-white/60 h-10 px-5 bg-transparent"
                      style={{ fontSize: '0.875rem', fontWeight: 600 }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Report Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <Button
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
  );
}
