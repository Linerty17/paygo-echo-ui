
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Gift, ArrowRight, Star } from 'lucide-react';

interface WelcomeMessageProps {
  onContinue: () => void;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ onContinue }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/40 to-gray-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-lavender-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      
      {/* Floating particles */}
      <div className="absolute top-1/4 right-1/4 animate-pulse">
        <Star className="w-4 h-4 text-purple-400/40" />
      </div>
      <div className="absolute bottom-1/3 left-1/4 animate-pulse delay-300">
        <Star className="w-3 h-3 text-lavender-400/40" />
      </div>
      
      <div className="w-full max-w-sm space-y-8 text-center relative z-10">
        {/* PayGo Logo with glass effect */}
        <div className="flex justify-center mb-8 w-full overflow-hidden relative h-24">
          <div className="absolute inset-0 w-full">
            <div className="animate-slide-logo-lr">
              <img 
                src="/lovable-uploads/paygo-wide-logo.png" 
                alt="PayGo Digital Logo" 
                className="w-72 h-20 object-fill drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Welcome badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-lavender-500/20 border border-purple-500/30 backdrop-blur-xl">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">Welcome Aboard!</span>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-lavender-300 bg-clip-text text-transparent">
            Welcome to PayGo!
          </h1>
          
          {/* Glass card with bonus info */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-lavender-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Gift className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <p className="text-gray-300 text-lg leading-relaxed">
              As a new user, you'll receive a generous welcome bonus of
            </p>
            
            <div className="my-4 py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-lavender-500/20 border border-purple-500/30">
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-lavender-400 bg-clip-text text-transparent">
                ₦180,000
              </span>
            </div>
            
            <p className="text-gray-400 text-sm">
              which can be withdrawn at any time. Yes, you read that right - it's yours to keep!
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <Button
              onClick={onContinue}
              className="w-full h-14 bg-gradient-to-r from-purple-600 via-purple-500 to-lavender-500 hover:opacity-90 text-white text-lg font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-purple-500/30 border border-purple-400/30 flex items-center justify-center gap-2 group"
            >
              Continue to Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;
