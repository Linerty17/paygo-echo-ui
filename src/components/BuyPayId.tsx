import React, { useState } from 'react';
import { ArrowLeft, CreditCard, User, Mail, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
      {/* Modern Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="glass w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10 hover:border-primary/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Buy PAY ID</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-4 pb-8 space-y-5">
        {/* Hero Card */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-lavender/10 to-primary/5 rounded-3xl" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          
          <div className="relative glass rounded-3xl p-6 border border-white/10 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-lavender flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Get Your PAY ID</h2>
            <p className="text-muted-foreground">Unlock full access to PayGo features</p>
            
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 glass rounded-full border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary font-bold">{amount}</span>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Full Name</p>
                <p className="text-foreground font-medium">
                  <TypewriterText 
                    text={userName} 
                    speed={100}
                    onComplete={handleTypewriterComplete}
                  />
                </p>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Email Address</p>
                <p className="text-foreground font-medium">
                  <TypewriterText 
                    text={userEmail} 
                    speed={80}
                  />
                </p>
              </div>
            </div>
          </div>
        </div>

        {showPayButton && (
          <Button 
            onClick={handlePay}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-lavender hover:opacity-90 text-white text-lg font-semibold shadow-lg shadow-primary/30 border-0 animate-fade-in"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Pay {amount}
          </Button>
        )}

        <p className="text-center text-muted-foreground text-sm">
          Your PAY ID will be displayed once payment is confirmed
        </p>

        <div className="text-center pt-4">
          <p className="text-foreground font-semibold">PayGo Financial Services</p>
        </div>
      </div>
    </div>
  );
};

export default BuyPayId;
