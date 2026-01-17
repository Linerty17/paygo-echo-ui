import React, { useEffect, useState } from 'react';
import { ShieldCheck, Sparkles, PartyPopper, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UnbannedScreenProps {
  onContinue: () => void;
}

const UnbannedScreen: React.FC<UnbannedScreenProps> = ({ onContinue }) => {
  const [showContent, setShowContent] = useState(false);
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; color: string; delay: number }>>([]);

  useEffect(() => {
    // Generate confetti
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];
    const newConfetti = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2
    }));
    setConfetti(newConfetti);

    setTimeout(() => setShowContent(true), 300);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 flex items-center justify-center z-50 overflow-hidden">
      {/* Confetti animation */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            left: `${piece.x}%`,
            top: '-5%',
            backgroundColor: piece.color,
            animation: `fall 3s linear infinite`,
            animationDelay: `${piece.delay}s`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      ))}

      {/* Glowing celebration orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 text-center px-6 max-w-md w-full">
        {/* Animated shield icon */}
        <div 
          className={`mb-8 transition-all duration-700 transform ${
            showContent ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-60 animate-pulse" />
            <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-2xl">
              <ShieldCheck className="w-18 h-18 text-white" strokeWidth={2} />
            </div>
            <PartyPopper className="absolute -top-3 -right-3 w-10 h-10 text-yellow-400 animate-bounce" />
            <Sparkles className="absolute -bottom-2 -left-3 w-8 h-8 text-pink-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
            <Heart className="absolute top-0 -left-4 w-6 h-6 text-red-400 animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h1 
          className={`text-3xl font-bold text-white mb-3 transition-all duration-500 delay-200 ${
            showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          Welcome Back! 🎊
        </h1>

        <p 
          className={`text-emerald-100 mb-4 text-lg transition-all duration-500 delay-300 ${
            showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          Your account has been restored!
        </p>

        <p 
          className={`text-emerald-200/80 mb-8 transition-all duration-500 delay-400 ${
            showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          We're happy to have you back. You now have full access to all features.
        </p>

        {/* Celebration box */}
        <div 
          className={`mb-8 transition-all duration-700 delay-500 ${
            showContent ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
          }`}
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-emerald-400/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-emerald-100 font-semibold">Account Reinstated</span>
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-emerald-200/70 text-sm">
              Continue enjoying our services. Please follow our community guidelines.
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <Button
          onClick={onContinue}
          className={`w-full py-6 text-lg font-semibold bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl shadow-xl transition-all duration-500 delay-600 ${
            showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          Continue to Dashboard
        </Button>
      </div>

      <style>{`
        @keyframes fall {
          0% { 
            transform: translateY(-100vh) rotate(0deg); 
            opacity: 1;
          }
          100% { 
            transform: translateY(100vh) rotate(720deg); 
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default UnbannedScreen;
