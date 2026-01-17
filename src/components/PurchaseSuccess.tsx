
import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PurchaseSuccessProps {
  onBack: () => void;
  type: 'airtime' | 'data';
  amount: string;
  phoneNumber: string;
}

const PurchaseSuccess: React.FC<PurchaseSuccessProps> = ({ onBack, type, amount, phoneNumber }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass-header text-foreground p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <h1 className="text-xl font-semibold">{type === 'airtime' ? 'Airtime' : 'Data'} Purchase</h1>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-8 lavender-glow">
          <Check className="w-12 h-12 text-green-400" />
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
          {type === 'airtime' ? 'Airtime' : 'Data'} Purchase Successful!
        </h2>

        <p className="text-muted-foreground text-center mb-8">
          Your {type} has been successfully added to {phoneNumber}
        </p>

        {/* Transaction Details */}
        <div className="glass-card rounded-2xl p-6 mb-8 w-full max-w-sm">
          <p className="text-center text-muted-foreground mb-2">Transaction Details</p>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-bold text-primary">{amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone:</span>
              <span className="font-medium text-foreground">{phoneNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-green-400 font-medium">Successful</span>
            </div>
          </div>
        </div>

        <Button 
          onClick={onBack}
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

export default PurchaseSuccess;
