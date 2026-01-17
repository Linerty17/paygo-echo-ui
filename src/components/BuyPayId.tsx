import React, { useState } from 'react';
import { ArrowLeft, CreditCard, User, Mail, Sparkles, Shield, Lock, CheckCircle2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TypewriterText from './TypewriterText';

interface BuyPayIdProps {
  onBack: () => void;
  onPayClicked: () => void;
  userName: string;
  userEmail: string;
}

const BuyPayId: React.FC<BuyPayIdProps> = ({ onBack, onPayClicked, userName, userEmail }) => {
  const [amount] = useState('₦6,500');
  const [showPayButton, setShowPayButton] = useState(false);

  const handleTypewriterComplete = () => {
    setShowPayButton(true);
  };

  const handlePay = () => {
    onPayClicked();
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
            <span className="text-sm text-muted-foreground">Secure Checkout</span>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="relative px-4 pb-8 space-y-6">
        {/* Payment Gateway Card */}
        <div className="relative">
          {/* Card Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 rounded-[28px] blur-xl opacity-40 animate-pulse" />
          
          <div className="relative glass-card rounded-3xl overflow-hidden">
            {/* Card Header with Gradient */}
            <div className="relative bg-gradient-to-br from-primary via-accent to-primary p-6 pb-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_50%)]" />
              
              <div className="relative flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/80 text-xs">PAYGO</p>
                    <p className="text-white font-bold text-sm">Payment Gateway</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Lock className="w-4 h-4 text-white/80" />
                  <span className="text-white/80 text-xs">256-bit SSL</span>
                </div>
              </div>

              <div className="relative text-center">
                <p className="text-white/60 text-sm mb-1">Amount to Pay</p>
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6 text-white/80 animate-pulse" />
                  <span className="text-4xl font-bold text-white tracking-tight">{amount}</span>
                </div>
                <p className="text-white/60 text-xs mt-2">One-time payment • Lifetime access</p>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 space-y-4">
              {/* User Info Fields */}
              <div className="space-y-3">
                <div className="group relative glass rounded-2xl p-4 border border-border/50 hover:border-primary/30 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Account Holder</p>
                      <p className="text-foreground font-semibold truncate">
                        <TypewriterText 
                          text={userName} 
                          speed={100}
                          onComplete={handleTypewriterComplete}
                        />
                      </p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  </div>
                </div>

                <div className="group relative glass rounded-2xl p-4 border border-border/50 hover:border-primary/30 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Email Address</p>
                      <p className="text-foreground font-semibold truncate">
                        <TypewriterText 
                          text={userEmail} 
                          speed={80}
                        />
                      </p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  </div>
                </div>
              </div>

              {/* What You Get */}
              <div className="glass rounded-2xl p-4 border border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">What you'll get</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Unique PAY ID', 'Instant Rewards', 'Priority Support', 'Full Access'].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                        <Zap className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        {showPayButton && (
          <div className="animate-fade-in">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
              <Button 
                onClick={handlePay}
                className="relative w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground text-lg font-bold shadow-xl border-0 overflow-hidden"
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />
                <CreditCard className="w-5 h-5 mr-2 relative z-10" />
                <span className="relative z-10">Pay {amount}</span>
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Lock className="w-3.5 h-3.5" />
                <span className="text-xs">Secure</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Shield className="w-3.5 h-3.5" />
                <span className="text-xs">Encrypted</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Zap className="w-3.5 h-3.5" />
                <span className="text-xs">Instant</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center space-y-2 pt-2">
          <p className="text-muted-foreground text-sm">
            Your PAY ID will be displayed once payment is confirmed
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-5 rounded bg-gradient-to-r from-blue-600 to-blue-400" />
            <div className="w-8 h-5 rounded bg-gradient-to-r from-red-500 to-yellow-500" />
            <div className="w-8 h-5 rounded bg-gradient-to-r from-indigo-600 to-purple-600" />
          </div>
          <p className="text-foreground font-semibold text-sm">PayGo Financial Services</p>
        </div>
      </div>
    </div>
  );
};

export default BuyPayId;
