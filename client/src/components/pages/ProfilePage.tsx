import { Calendar, Shield, Flag, Sparkles } from 'lucide-react';
import { VideoCard } from '../VideoCard';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { motion } from 'framer-motion';

interface ProfilePageProps {
  onViewCertificate: (videoId: string) => void;
}

export function ProfilePage({ onViewCertificate }: ProfilePageProps) {
  const profile = {
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    memberSince: 'June 2024',
    verifiedCount: 12,
  };

  const verifiedVideos = [
    {
      id: '1',
      title: 'Summer Vacation Vlog 2024',
      thumbnail:
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
      date: 'October 15, 2024',
      verified: true,
    },
    {
      id: '2',
      title: 'Product Launch Presentation',
      thumbnail:
        'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=800',
      date: 'September 3, 2024',
      verified: true,
    },
    {
      id: '3',
      title: 'Creative Time-lapse Project',
      thumbnail:
        'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800',
      date: 'August 22, 2024',
      verified: true,
    },
    {
      id: '4',
      title: 'Documentary Series Episode 1',
      thumbnail:
        'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800',
      date: 'July 10, 2024',
      verified: true,
    },
    {
      id: '5',
      title: 'Music Video Production',
      thumbnail:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      date: 'June 18, 2024',
      verified: true,
    },
    {
      id: '6',
      title: 'Tutorial Series Part 1',
      thumbnail:
        'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800',
      date: 'June 5, 2024',
      verified: true,
    },
  ];

  const conflicts = [
    {
      id: '1',
      title: 'Potential duplicate detected',
      status: 'resolved' as const,
      date: 'October 20, 2024',
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 mb-10"
        >
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            <Avatar className="w-20 h-20 border-2 border-[#A7E6FF]/40 shadow-lg">
              <AvatarFallback
                className="bg-gradient-to-br from-[#A7E6FF] to-[#C6A0F6] text-[#16213E]"
                style={{ fontSize: '1.5rem', fontWeight: 700 }}
              >
                {profile.address.slice(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h2
                  className="text-[#16213E]"
                  style={{ fontSize: '1.5rem', fontWeight: 800 }}
                >
                  {profile.address}
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
                    {profile.verifiedCount} verified videos
                  </span>
                </div>
              </div>

              <p
                className="text-[#16213E]/70 max-w-2xl"
                style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}
              >
                Independent creator protecting original content through
                blockchain verification. Every piece of content is unique and
                authenticated.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Verified Videos Section */}
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
                {verifiedVideos.length} total
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {verifiedVideos.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <VideoCard
                  {...video}
                  onClick={() => onViewCertificate(video.id)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Conflict Alerts Section */}
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
                      className="glass text-[#16213E] border-[#A7E6FF]/40 hover:bg-white/60 h-10 px-5"
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
            className="glass-card text-[#16213E] border-[#A7E6FF]/40 hover:bg-white/60 h-12 px-6"
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
