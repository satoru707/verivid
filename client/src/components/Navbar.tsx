import { useState } from "react"
import { Sparkles, Wallet } from "lucide-react"
import { Button } from "./ui/button"
import { Link, useNavigate } from "@tanstack/react-router"
import { useWallet } from "../context/use-wallet"
import { WalletConnectModal } from "./WalletConnectModal"
import { WalletDropdown } from "./WalletDropdown"

export function Navbar() {
  const [currentPage, setCurrentPage] = useState<string>("home")
  const { isConnected, walletAddress, isLoading } = useWallet()
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const navigate = useNavigate()

  const navItems = [
    { id: "/", label: "Home" },
    { id: "/upload", label: "Verify Video" },
    { id: "/check-auth", label: "Check Authenticity" },
    { id: "/docs", label: "Docs" },
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto glass-strong rounded-3xl px-8 py-4 flex items-center justify-between shadow-lg">
          <button className="flex items-center gap-3 transition-all hover:scale-105">
            <div className="relative">
              <Sparkles className="w-9 h-9 text-[#A7E6FF]" fill="#A7E6FF" />
              <div className="absolute inset-0 glow-ice-subtle rounded-full blur-md"></div>
            </div>
            <span
              className="text-[#16213E] tracking-tight hidden sm:block"
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              VeriVid
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <Link key={item.id} to={item.id}>
                <button
                  onClick={() => setCurrentPage(item.id)}
                  className={`px-5 py-2.5 rounded-xl transition-all ${
                    currentPage === item.id
                      ? "bg-white/60 text-[#16213E] shadow-sm"
                      : "text-[#16213E]/70 hover:text-[#16213E] hover:bg-white/40"
                  }`}
                  style={{ fontSize: "0.9375rem", fontWeight: 500 }}
                >
                  {item.label}
                </button>
              </Link>
            ))}
          </div>

          {!isConnected ? (
            <Button
              onClick={() => {
                setIsWalletModalOpen(true)
              }}
              disabled={isLoading}
              className="bg-gradient-to-r from-[#A7E6FF] to-[#C6A0F6] text-[#16213E] hover:shadow-xl hover:scale-105 transition-all glow-ice-subtle border-0 px-6 py-2.5 disabled:opacity-50"
              style={{ fontWeight: 600 }}
            >
              <Wallet className="w-4 h-4 mr-2" />
              {isLoading ? "Connecting..." : "Connect Wallet"}
            </Button>
          ) : (
            <WalletDropdown onNavigateToProfile={() => navigate({ to: "/profile" })}>
              <button className="glass-card px-5 py-2.5 rounded-xl hover:bg-white/60 transition-all flex items-center gap-3 group">
                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#A7E6FF] to-[#C6A0F6] glow-ice"></div>
                <code
                  className="text-[#16213E] font-mono hidden sm:block"
                  style={{ fontSize: "0.9375rem", fontWeight: 600 }}
                >
                  {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                </code>
                <Wallet className="w-4 h-4 text-[#16213E]/60 group-hover:text-[#16213E] transition-colors sm:hidden" />
              </button>
            </WalletDropdown>
          )}
        </div>
      </nav>

      <WalletConnectModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
    </>
  )
}
