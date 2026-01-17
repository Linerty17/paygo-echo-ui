import React, { useEffect, useState } from 'react';
import { XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaymentDeclinedScreenProps {
  reason?: string;
  onRetry: () => void;
  onContactSupport: () => void;
}

const PaymentDeclinedScreen: React.FC<PaymentDeclinedScreenProps> = ({
  reason = "Your payment could not be verified. Please ensure you upload a valid payment receipt.",
  onRetry,
  onContactSupport
}) => {
  const [showContent, setShowContent] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowContent(true);
      setShake(true);
    }, 200);
    setTimeout(() => setShake(false), 700);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-red-900 via-red-800 to-rose-900 flex items-center justify-center z-50 overflow-hidden">
      {/* Animated warning lines */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-red-400/30 to-transparent w-full"
            style={{
              top: `${20 + i * 15}%`,
              animation: `slide ${2 + i * 0.5}s linear infinite`,
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-rose-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 text-center px-6 max-w-md w-full">
        {/* Animated X icon */}
        <div 
          className={`mb-8 transition-all duration-500 transform ${
            showContent ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          } ${shake ? 'animate-shake' : ''}`}
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-red-400 rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative w-28 h-28 mx-auto bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-2xl">
              <XCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
            </div>
            <AlertTriangle className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-bounce" />
          </div>
        </div>

        {/* Title */}
        <h1 
          className={`text-3xl font-bold text-white mb-3 transition-all duration-500 delay-200 ${
            showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          Payment Not Confirmed
        </h1>

        <p 
          className={`text-red-100 mb-6 transition-all duration-500 delay-300 ${
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
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-red-400/30">
            <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <p className="text-red-100 text-sm">
              If you believe this is an error, please contact support with your payment details.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className={`space-y-3 transition-all duration-500 delay-500 ${
          showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <Button
            onClick={onRetry}
            className="w-full py-6 text-lg font-semibold bg-white text-red-800 hover:bg-red-50 rounded-xl shadow-xl flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </Button>
          <Button
            onClick={onContactSupport}
            variant="outline"
            className="w-full py-6 text-lg font-semibold border-white/30 text-white hover:bg-white/10 rounded-xl"
          >
            Contact Support
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default PaymentDeclinedScreen;
