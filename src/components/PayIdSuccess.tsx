
import React from 'react';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PayIdSuccessProps {
  onBack: () => void;
  payIdCode?: string;
}

const PayIdSuccess: React.FC<PayIdSuccessProps> = ({ onBack, payIdCode }) => {
  const payId = payIdCode || 'PAY-00000000';

  const handleCopy = () => {
    navigator.clipboard.writeText(payId);
  };

  const handleContinueToDashboard = () => {
    onBack();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass-header text-foreground p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <h1 className="text-xl font-semibold">PAY ID Confirmed</h1>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-8 lavender-glow">
          <Check className="w-12 h-12 text-green-400" />
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
          Payment Confirmed!
        </h2>

        <p className="text-muted-foreground text-center mb-8">
          Your PAY ID has been successfully generated
        </p>

        {/* PAY ID Display */}
        <div className="glass-card rounded-2xl p-6 mb-8 w-full max-w-sm">
          <p className="text-center text-muted-foreground mb-2">Your PAY ID</p>
          <div className="flex items-center justify-between glass rounded-xl p-4">
            <span className="text-2xl font-bold text-primary">{payId}</span>
            <Button 
              onClick={handleCopy}
              className="bg-primary hover:bg-primary/80 text-primary-foreground p-2 rounded-lg"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-center text-muted-foreground text-sm mt-3">
            Use this PAY ID for airtime/data purchases and withdrawals
          </p>
        </div>

        <Button 
          onClick={handleContinueToDashboard}
          className="w-full max-w-sm h-14 bg-primary hover:bg-primary/80 text-primary-foreground text-lg font-medium rounded-xl lavender-glow"
        >
          Continue to Dashboard
        </Button>

        <div className="mt-16 text-center">
          <p className="text-foreground font-semibold">PayGo Financial Services LTD</p>
        </div>
      </div>
    </div>
  );
};

export default PayIdSuccess;
