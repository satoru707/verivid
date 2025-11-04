import { Sparkles, Check } from 'lucide-react';

interface VerificationBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  verified?: boolean;
}

export function VerificationBadge({ size = 'md', showText = true, verified = true }: VerificationBadgeProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  if (!verified) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-2">
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-[#A7E6FF] to-[#C6A0F6] flex items-center justify-center glow-ice`}>
          <Check className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-5 h-5' : 'w-7 h-7'} text-[#16213E]`} strokeWidth={3} />
        </div>
        <Sparkles className={`absolute -top-1 -right-1 ${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} text-[#C6A0F6]`} fill="#C6A0F6" />
      </div>
      {showText && (
        <span className={`${textSizeClasses[size]} text-[#16213E]`} style={{ fontWeight: 600 }}>
          Verified
        </span>
      )}
    </div>
  );
}
