"use client"

import { useEffect } from "react"

interface SplashScreenProps {
  onComplete?: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.()
    }, 4000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-600 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-white/5 rounded-full blur-lg animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-white/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: "0.5s" }}></div>
      </div>

      {/* Background Durga Image with Enhanced Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40">
        <div
          className="w-full h-full bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('/durga-maa-idol-with-multiple-arms-golden-backgroun.jpg')`,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-md">
        {/* West Bengal Police Logo */}
        <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
          <div className="relative">
            <img 
              src="/wblogo.png" 
              alt="West Bengal Police"
              className="w-28 h-28 object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
              style={{
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4)) drop-shadow(0 4px 8px rgba(0,0,0,0.3)) drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
              }}
              onError={(e) => {
                // Fallback if image doesn't load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'flex';
              }}
            />
            {/* Fallback logo */}
            <div className="w-28 h-28 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-sm text-center leading-tight hidden"
                 style={{
                   filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4)) drop-shadow(0 4px 8px rgba(0,0,0,0.3)) drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                 }}>
              WB<br/>POLICE
            </div>
            {/* Enhanced shadow beneath logo for raised effect */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black/20 rounded-full blur-lg opacity-60"></div>
            {/* Subtle glow effect behind logo */}
            <div className="absolute inset-0 w-28 h-28 bg-white/5 rounded-full blur-xl animate-pulse -z-10"></div>
          </div>
        </div>

        {/* Department Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-1 drop-shadow-2xl tracking-wide">
            West Bengal Police  
          </h1>
          <div className="w-20 h-1 bg-white/60 mx-auto rounded-full mb-2"></div>
          <h2 className="text-lg text-white/95 drop-shadow-lg font-medium italic">
            With You - Always
          </h2>
        </div>

        {/* Main App Branding */}
        <div className="mb-8 bg-white/10 backdrop-blur-sm rounded-3xl px-8 py-6 border border-white/20 shadow-2xl">
          <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-2xl bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
            Sabar Pujo
          </h1>
          <p className="text-xl text-white/95 drop-shadow-lg font-medium">
            Festival Companion
          </p>
          
          {/* Decorative Diya */}
          <div className="flex justify-center mt-4">
            <div className="relative">
              <div className="w-12 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full shadow-lg">
                <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-3 bg-yellow-300 rounded-full"></div>
                <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-orange-300 rounded-full"></div>
                {/* Flame glow */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-400/60 rounded-full blur-sm animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tagline */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-3 drop-shadow-2xl">
            Celebrate Smart, Celebrate Safe
          </h3>
          <p className="text-lg text-white/90 drop-shadow-lg leading-relaxed">
            Discover Puja Pandals & Essential Services
          </p>
        </div>

        {/* Enhanced Loading Animation */}
        <div className="flex flex-col items-center">
          <div className="flex space-x-3 mb-3">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce shadow-lg"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce shadow-lg" style={{ animationDelay: "0.15s" }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce shadow-lg" style={{ animationDelay: "0.3s" }}></div>
          </div>
          <p className="text-white/80 text-sm font-medium animate-pulse">
            Loading your festival experience...
          </p>
        </div>
      </div>

      {/* Bottom Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent"></div>
    </div>
  )
}