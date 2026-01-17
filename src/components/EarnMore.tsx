
import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EarnMoreProps {
  onBack: () => void;
}

const EarnMore: React.FC<EarnMoreProps> = ({ onBack }) => {
  const handleSignUpNow = () => {
    window.open('https://bluepay2026.netlify.app/', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass-header p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Earn More</h1>
        </div>
      </div>

      <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 text-center">
          
          <div className="space-y-8">
            <h1 className="text-5xl font-bold text-primary mb-8">BluePay</h1>
            
            <div className="space-y-6">
              <p className="text-xl leading-relaxed text-foreground">
                Take your earnings to the next level with BluePay.
              </p>
              
              <p className="text-lg leading-relaxed text-muted-foreground">
                Access exclusive features and higher earning opportunities.
              </p>
              
              <p className="text-lg leading-relaxed text-muted-foreground">
                Join thousands of users already maximizing their income.
              </p>
            </div>

            <Button
              onClick={handleSignUpNow}
              className="w-full h-16 bg-primary hover:bg-primary/80 text-primary-foreground text-xl font-bold rounded-xl transition-all duration-300 lavender-glow flex items-center justify-center space-x-3"
            >
              <span>Sign Up Now</span>
              <ExternalLink className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarnMore;
