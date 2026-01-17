
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
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
      {/* Header */}
      <div className="glass-header text-foreground p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <h1 className="text-xl font-semibold">Buy PAY ID</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label className="block text-foreground text-lg font-medium mb-3">Amount</label>
          <div className="w-full h-14 glass-card rounded-xl flex items-center px-4">
            <span className="text-lg text-muted-foreground">{amount}</span>
          </div>
        </div>

        <div>
          <label className="block text-foreground text-lg font-medium mb-3">Full Name</label>
          <div className="w-full h-14 glass-card rounded-xl flex items-center px-4">
            <span className="text-lg text-foreground">
              <TypewriterText 
                text={userName} 
                speed={100}
                onComplete={handleTypewriterComplete}
              />
            </span>
          </div>
        </div>

        <div>
          <label className="block text-foreground text-lg font-medium mb-3">Your Email Address</label>
          <div className="w-full h-14 glass-card rounded-xl flex items-center px-4">
            <span className="text-lg text-foreground">
              <TypewriterText 
                text={userEmail} 
                speed={80}
              />
            </span>
          </div>
        </div>

        {showPayButton && (
          <Button 
            onClick={handlePay}
            className="w-full h-14 bg-primary hover:bg-primary/80 text-primary-foreground text-lg font-medium rounded-xl mt-8 animate-fade-in lavender-glow"
          >
            Pay
          </Button>
        )}

        <p className="text-center text-muted-foreground text-sm mt-6">
          Your PAY ID will be displayed on the app once your payment is confirmed.
        </p>

        <div className="text-center mt-12">
          <p className="text-foreground font-semibold">PayGo Financial Services LTD</p>
        </div>
      </div>
    </div>
  );
};

export default BuyPayId;
