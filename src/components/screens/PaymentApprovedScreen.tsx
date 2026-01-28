import React, { useEffect, useState } from 'react';
import { CheckCircle, Sparkles, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface PaymentApprovedScreenProps {
  payIdCode: string;
  onContinue: () => void;
}

const PaymentApprovedScreen: React.FC<PaymentApprovedScreenProps> = ({ 
  payIdCode, 
  onContinue 
}) => {
  const [showContent, setShowContent] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Generate celebration particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);

    // Animate content appearance
    setTimeout(() => setShowContent(true), 300);
    setTimeout(() => setShowCode(true), 800);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(payIdCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "PAY ID code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy manually",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900 flex items-center justify-center z-50 overflow-hidden">
      {/* Animated background particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full bg-emerald-400/30 animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animation: `float 3s ease-in-out infinite ${particle.delay}s`
          }}
        />
      ))}

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-green-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 text-center px-6 max-w-md w-full">
        {/* Animated checkmark */}
        <div 
          className={`mb-8 transition-all duration-700 transform ${
            showContent ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative w-28 h-28 mx-auto bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-bounce" />
            <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-yellow-300 animate-bounce" style={{ animationDelay: '0.3s' }} />
          </div>
        </div>

        {/* Title */}
        <h1 
          className={`text-3xl font-bold text-white mb-3 transition-all duration-500 delay-200 ${
            showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          Payment Approved! 🎉
        </h1>

        <p 
          className={`text-emerald-100 mb-8 transition-all duration-500 delay-300 ${
            showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          Your payment has been verified and approved. Here's your PAY ID code:
        </p>

        {/* PAY ID Code Display */}
        <div 
          className={`mb-8 transition-all duration-700 delay-500 ${
            showCode ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
          }`}
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <p className="text-emerald-200 text-sm mb-2">Your PAY ID Code</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl md:text-3xl font-mono font-bold text-white tracking-wider">
                {payIdCode}
              </span>
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Copy className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
            <p className="text-emerald-200/70 text-xs mt-3">
              Use this code for all transactions
            </p>
            
            {/* Activation Notice */}
            <a 
              href="https://paygo2-activation.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 p-3 rounded-xl bg-amber-500/30 border border-amber-400/50 hover:bg-amber-500/40 transition-all duration-300 group"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
                </span>
                <span className="text-amber-300 font-semibold text-sm">
                  ⚡ Kindly activate your PAY ID before use
                </span>
              </div>
              <div className="flex items-center justify-center gap-1 mt-2 text-amber-200 text-xs">
                <span>👆 Tap here to activate</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </a>
          </div>
        </div>

        {/* Continue Button */}
        <Button
          onClick={onContinue}
          className={`w-full py-6 text-lg font-semibold bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl shadow-xl transition-all duration-500 delay-700 ${
            showCode ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          Continue to Dashboard
        </Button>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default PaymentApprovedScreen;
