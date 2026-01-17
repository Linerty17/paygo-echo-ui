import React, { useEffect, useState } from 'react';
import { KeyRound, AlertOctagon, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PayIdRevokedScreenProps {
  reason?: string;
  onContactSupport: () => void;
  onBuyNewPayId: () => void;
}

const PayIdRevokedScreen: React.FC<PayIdRevokedScreenProps> = ({
  reason = "Your PAY ID has been revoked by the administrator. This may be due to policy violations or account issues.",
  onContactSupport,
  onBuyNewPayId
}) => {
  const [showContent, setShowContent] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 200);
    
    // Rotating animation for the key icon
    const interval = setInterval(() => {
      setRotation(prev => prev + 180);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-900 via-orange-800 to-yellow-900 flex items-center justify-center z-50 overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 35px,
            rgba(255,255,255,0.1) 35px,
            rgba(255,255,255,0.1) 70px
          )`
        }} />
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 text-center px-6 max-w-md w-full">
        {/* Animated key icon */}
        <div 
          className={`mb-8 transition-all duration-700 transform ${
            showContent ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-50 animate-pulse" />
            <div 
              className="relative w-28 h-28 mx-auto bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-1000"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <KeyRound className="w-14 h-14 text-white" strokeWidth={2} />
            </div>
            <div className="absolute -top-1 -right-1 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center border-4 border-amber-900">
              <AlertOctagon className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 
          className={`text-3xl font-bold text-white mb-3 transition-all duration-500 delay-200 ${
            showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          PAY ID Revoked
        </h1>

        <p 
          className={`text-amber-100 mb-8 transition-all duration-500 delay-300 ${
            showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          {reason}
        </p>

        {/* Info box */}
        <div 
          className={`mb-8 transition-all duration-700 delay-400 ${
            showContent ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
          }`}
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-amber-400/30">
            <p className="text-amber-100 text-sm">
              You can purchase a new PAY ID or contact support for more information about this action.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className={`space-y-3 transition-all duration-500 delay-500 ${
          showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <Button
            onClick={onBuyNewPayId}
            className="w-full py-6 text-lg font-semibold bg-white text-amber-800 hover:bg-amber-50 rounded-xl shadow-xl"
          >
            Get New PAY ID
          </Button>
          <Button
            onClick={onContactSupport}
            variant="outline"
            className="w-full py-6 text-lg font-semibold border-white/30 text-white hover:bg-white/10 rounded-xl flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PayIdRevokedScreen;
