
import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TransferSuccessProps {
  onBack: () => void;
  amount: string;
}

const TransferSuccess: React.FC<TransferSuccessProps> = ({ onBack, amount }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Success Icon */}
      <div className="relative mb-8">
        <div className="w-32 h-32 glass-card rounded-full flex items-center justify-center lavender-glow">
          <Check className="w-16 h-16 text-primary" />
        </div>
        <div className="absolute -top-2 -right-2 w-12 h-12 glass rounded-full flex items-center justify-center">
          <span className="text-2xl">🎉</span>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-primary mb-4 text-center">
        Transfer Successful!
      </h1>

      <p className="text-muted-foreground text-center mb-8 text-lg">
        Your transfer of {amount} has been processed successfully.
      </p>

      <div className="glass-card rounded-2xl px-6 py-3 mb-8">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🎉</span>
          <span className="text-primary font-semibold">Success</span>
        </div>
      </div>

      <Button 
        onClick={onBack}
        className="w-full max-w-sm h-14 bg-primary hover:bg-primary/80 text-primary-foreground text-lg font-medium rounded-xl lavender-glow"
      >
        Back to Dashboard
      </Button>
    </div>
  );
};

export default TransferSuccess;
