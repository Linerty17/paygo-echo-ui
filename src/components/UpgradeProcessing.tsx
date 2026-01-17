
import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface UpgradeProcessingProps {
  onBack: () => void;
  onComplete: () => void;
  levelName: string;
  price: string;
}

const UpgradeProcessing: React.FC<UpgradeProcessingProps> = ({ 
  onBack, 
  onComplete, 
  levelName, 
  price 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass-header text-foreground p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <h1 className="text-xl font-semibold">Processing Upgrade</h1>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
        <div className="glass-card rounded-2xl p-8 text-center max-w-md w-full">
          <div className="mb-6">
            <div className="w-16 h-16 glass rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Processing Details for Payment</h2>
            <p className="text-muted-foreground">Please wait while we prepare your {levelName} level upgrade...</p>
          </div>

          <div className="glass rounded-xl p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-1">Upgrade Level</p>
            <p className="text-lg font-semibold text-primary">{levelName}</p>
            <p className="text-sm text-muted-foreground mt-2 mb-1">Amount</p>
            <p className="text-xl font-bold text-foreground">{price}</p>
          </div>

          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeProcessing;
