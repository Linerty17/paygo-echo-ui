import React, { useEffect, useState } from 'react';
import { Ban, ShieldX, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BannedScreenProps {
  reason?: string;
  onContactSupport: () => void;
}

const BannedScreen: React.FC<BannedScreenProps> = ({
  reason = "Your account has been suspended due to violation of our terms of service.",
  onContactSupport
}) => {
  const [showContent, setShowContent] = useState(false);
  const [pulseIntensity, setPulseIntensity] = useState(0);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 200);
    
    // Pulsing effect
    const interval = setInterval(() => {
      setPulseIntensity(prev => (prev + 1) % 3);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 flex items-center justify-center z-[9999] overflow-hidden">
      {/* Danger stripes */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              #ef4444,
              #ef4444 10px,
              transparent 10px,
              transparent 20px
            )`,
            backgroundSize: '200% 200%',
            animation: 'stripes 20s linear infinite'
          }}
        />
      </div>

      {/* Dark vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />

      {/* Pulsing red glow */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full transition-all duration-1000 ${
          pulseIntensity === 0 ? 'bg-red-600/10 blur-3xl scale-100' :
          pulseIntensity === 1 ? 'bg-red-600/20 blur-3xl scale-110' :
          'bg-red-600/15 blur-3xl scale-105'
        }`}
      />

      <div className="relative z-10 text-center px-6 max-w-md w-full">
        {/* Animated ban icon */}
        <div 
          className={`mb-8 transition-all duration-700 transform ${
            showContent ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-red-600 rounded-full blur-2xl opacity-40 animate-pulse" />
            <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-2xl border-4 border-red-400/30">
              <Ban className="w-20 h-20 text-white" strokeWidth={2} />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1">
              <ShieldX className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 
          className={`text-4xl font-bold text-white mb-3 transition-all duration-500 delay-200 ${
            showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          Account Suspended
        </h1>

        <p 
          className={`text-red-200 mb-8 text-lg transition-all duration-500 delay-300 ${
            showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          {reason}
        </p>

        {/* Warning box */}
        <div 
          className={`mb-8 transition-all duration-700 delay-400 ${
            showContent ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
          }`}
        >
          <div className="bg-red-950/50 backdrop-blur-lg rounded-2xl p-6 border border-red-500/30">
            <p className="text-red-100 text-sm">
              You no longer have access to any features of this application. 
              If you believe this is a mistake, please contact our support team.
            </p>
          </div>
        </div>

        {/* Contact Support Button */}
        <Button
          onClick={onContactSupport}
          className={`w-full py-6 text-lg font-semibold bg-white text-red-800 hover:bg-red-50 rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all duration-500 delay-500 ${
            showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <Mail className="w-5 h-5" />
          Contact Support
        </Button>
      </div>

      <style>{`
        @keyframes stripes {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
      `}</style>
    </div>
  );
};

export default BannedScreen;
