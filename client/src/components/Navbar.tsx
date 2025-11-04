import { Sparkles } from 'lucide-react';
import { Button } from './ui/button';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onAuth: () => void;
}

export function Navbar({ currentPage, onNavigate, onAuth }: NavbarProps) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'verify', label: 'Verify Video' },
    { id: 'check', label: 'Check Authenticity' },
    { id: 'docs', label: 'Docs' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-6">
      <div className="max-w-7xl mx-auto glass-strong rounded-3xl px-8 py-4 flex items-center justify-between shadow-lg">
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 transition-all hover:scale-105"
        >
          <div className="relative">
            <Sparkles className="w-9 h-9 text-[#A7E6FF]" fill="#A7E6FF" />
            <div className="absolute inset-0 glow-ice-subtle rounded-full blur-md"></div>
          </div>
          <span className="text-[#16213E] tracking-tight hidden sm:block" style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            VeriVid
          </span>
        </button>

        {/* Center Nav Items */}
        <div className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-5 py-2.5 rounded-xl transition-all ${
                currentPage === item.id
                  ? 'bg-white/60 text-[#16213E] shadow-sm'
                  : 'text-[#16213E]/70 hover:text-[#16213E] hover:bg-white/40'
              }`}
              style={{ fontSize: '0.9375rem', fontWeight: 500 }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Auth Button */}
        <Button
          onClick={onAuth}
          className="bg-gradient-to-r from-[#A7E6FF] to-[#C6A0F6] text-[#16213E] hover:shadow-xl hover:scale-105 transition-all glow-ice-subtle border-0 px-6 py-2.5"
          style={{ fontWeight: 600 }}
        >
          Connect Wallet
        </Button>
      </div>
    </nav>
  );
}
