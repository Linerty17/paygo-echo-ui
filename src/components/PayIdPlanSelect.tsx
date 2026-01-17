import React from 'react';
import { ArrowLeft, Globe, MapPin, Sparkles, Shield, Zap, CreditCard } from 'lucide-react';

interface PayIdPlanSelectProps {
  onBack: () => void;
  onSelectOnline: () => void;
  onSelectOffline: () => void;
  onTapToUpload: () => void;
}

const PayIdPlanSelect: React.FC<PayIdPlanSelectProps> = ({ 
  onBack, 
  onSelectOnline, 
  onSelectOffline,
  onTapToUpload 
}) => {
  const handleOnlineClick = () => {
    // Open payment link in new tab immediately
    window.open('https://checkout.nomba.com/payment-link/5947052450', '_blank');
    onSelectOnline();
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-32 w-48 h-48 bg-accent/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-32 right-1/4 w-56 h-56 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <div className="relative px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="glass w-10 h-10 rounded-2xl flex items-center justify-center border border-border/50 hover:border-primary/30 hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-muted-foreground">Choose Plan</span>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="relative px-4 pb-8 space-y-6">
        {/* Title Section */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            <h1 className="text-2xl font-bold text-foreground">Get Your PAY ID</h1>
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground">Select your preferred payment method</p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Buy Online Card */}
          <button
            onClick={handleOnlineClick}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/50 to-emerald-500/50 rounded-[24px] blur-lg opacity-40 group-hover:opacity-70 transition-opacity" />
            <div className="relative glass-card rounded-3xl p-6 border border-green-500/30 hover:border-green-500/60 transition-all duration-300 h-full flex flex-col items-center justify-center space-y-4 hover:scale-[1.02]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-foreground mb-1">Buy Online</h3>
                <p className="text-2xl font-bold text-green-500">₦7,200</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-green-500">
                <Zap className="w-3.5 h-3.5" />
                <span>Instant</span>
              </div>
            </div>
          </button>

          {/* Buy Offline Card */}
          <button
            onClick={onSelectOffline}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/50 to-orange-500/50 rounded-[24px] blur-lg opacity-40 group-hover:opacity-70 transition-opacity" />
            <div className="relative glass-card rounded-3xl p-6 border border-amber-500/30 hover:border-amber-500/60 transition-all duration-300 h-full flex flex-col items-center justify-center space-y-4 hover:scale-[1.02]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-foreground mb-1">Buy Offline</h3>
                <p className="text-2xl font-bold text-amber-500">₦7,700</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-amber-500">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Bank Transfer</span>
              </div>
            </div>
          </button>
        </div>

        {/* What You Get Section */}
        <div className="glass-card rounded-3xl p-5 border border-border/50">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">What you'll get</p>
          <div className="grid grid-cols-2 gap-3">
            {['Unique PAY ID', 'Instant Rewards', 'Priority Support', 'Full Access'].map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Zap className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Button for Online Purchases */}
        <button
          onClick={onTapToUpload}
          className="w-full glass-card rounded-2xl p-4 border border-primary/30 hover:border-primary/60 transition-all duration-300 flex items-center justify-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-semibold text-primary">Tap to Upload</span>
        </button>

        {/* Security Footer */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Shield className="w-3.5 h-3.5" />
            <span className="text-xs">Secure</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Zap className="w-3.5 h-3.5" />
            <span className="text-xs">Fast</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs">Trusted</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-2">
          <p className="text-foreground font-semibold text-sm">PayGo Financial Services</p>
        </div>
      </div>
    </div>
  );
};

export default PayIdPlanSelect;
