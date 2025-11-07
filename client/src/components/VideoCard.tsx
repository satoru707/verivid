import { Calendar, Shield, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  date: string;
  verified: boolean;
  onClick?: () => void;
}

export function VideoCard({
  title,
  thumbnail,
  date,
  verified,
  onClick,
}: VideoCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-card rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-xl transition-all"
      onClick={onClick}
    >
      <div className="relative aspect-video bg-gradient-to-br from-[#C9D6DF] to-[#A7E6FF] overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {verified && (
          <div className="absolute top-3 right-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#A7E6FF] to-[#C6A0F6] flex items-center justify-center shadow-lg glow-ice">
                <Sparkles
                  className="w-5 h-5 text-[#16213E]"
                  strokeWidth={2}
                  fill="#16213E"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-[#A7E6FF] to-[#C6A0F6] flex items-center justify-center shadow-md border border-white">
                <Shield
                  className="w-2.5 h-2.5 text-[#16213E]"
                  strokeWidth={3}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3
          className="text-[#16213E] mb-3 line-clamp-2 group-hover:text-[#A7E6FF] transition-colors"
          style={{ fontSize: '1rem', fontWeight: 700 }}
        >
          {title}
        </h3>
        <div className="flex items-center gap-2 text-[#16213E]/60">
          <Calendar className="w-4 h-4" />
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{date}</span>
        </div>
      </div>
    </motion.div>
  );
}
