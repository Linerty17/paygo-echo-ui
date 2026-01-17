import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, Sparkles, Phone, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PurchaseSuccessProps {
  onBack: () => void;
  type: 'airtime' | 'data';
  amount: string;
  phoneNumber: string;
}

const PurchaseSuccess: React.FC<PurchaseSuccessProps> = ({ onBack, type, amount, phoneNumber }) => {
  const [showContent, setShowContent] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    setTimeout(() => setShowCheck(true), 200);
    setTimeout(() => setShowContent(true), 600);
    setTimeout(() => setShowDetails(true), 900);
  }, []);

  const isData = type === 'data';
  const TypeIcon = isData ? Wifi : Phone;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-lavender/5 rounded-full blur-[120px]" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400/30 rounded-full animate-bounce"
            style={{
              left: `${20 + i * 12}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Success Icon */}
      <div className={`relative mb-8 transition-all duration-700 ${showCheck ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-2xl shadow-emerald-500/40">
          <Check className="w-14 h-14 text-white" strokeWidth={3} />
        </div>
        <div className="absolute -top-2 -right-2 w-10 h-10 glass rounded-full flex items-center justify-center border border-white/20 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-400" />
        </div>
        {/* Ripple Effect */}
        <div className="absolute inset-0 rounded-full border-4 border-emerald-400/30 animate-ping" />
      </div>

      {/* Title */}
      <h1 className={`text-2xl font-bold text-foreground mb-2 text-center transition-all duration-700 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        {isData ? 'Data' : 'Airtime'} Purchase Successful!
      </h1>

      <p className={`text-muted-foreground text-center mb-6 transition-all duration-700 delay-100 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        Your {type} has been delivered to {phoneNumber}
      </p>

      {/* Details Card */}
      <div className={`glass rounded-3xl p-5 mb-6 w-full max-w-sm border border-white/10 transition-all duration-700 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        {/* Type Icon & Amount */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/10">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
            isData 
              ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/30' 
              : 'bg-gradient-to-br from-emerald-500 to-green-600 shadow-emerald-500/30'
          }`}>
            <TypeIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">{isData ? 'Data Bundle' : 'Airtime'}</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              {amount}
            </p>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground text-sm">Phone</span>
            </div>
            <span className="font-semibold text-foreground">{phoneNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Date</span>
            <span className="font-medium text-foreground text-sm">{getCurrentDate()}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-muted-foreground text-sm">Status</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-medium text-sm">Successful</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Button 
        onClick={onBack}
        className={`w-full max-w-sm h-14 rounded-2xl bg-gradient-to-r from-primary via-lavender to-accent hover:opacity-90 text-white text-lg font-semibold shadow-lg shadow-primary/30 border-0 transition-all duration-700 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        Continue to Dashboard
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>

      {/* Footer */}
      <p className={`mt-8 text-muted-foreground text-xs transition-all duration-700 delay-300 ${showDetails ? 'opacity-100' : 'opacity-0'}`}>
        PayGo Financial Services
      </p>
    </div>
  );
};

export default PurchaseSuccess;