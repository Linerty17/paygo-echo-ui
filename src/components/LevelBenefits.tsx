
import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LevelBenefitsProps {
  onBack: () => void;
  levelName: string;
  price: string;
  icon: string;
  benefits: string[];
  onProceedToPayment: () => void;
}

const LevelBenefits: React.FC<LevelBenefitsProps> = ({ 
  onBack, 
  levelName, 
  price, 
  icon, 
  benefits, 
  onProceedToPayment 
}) => {
  const getLevelBackgroundColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'silver': return 'bg-gradient-to-br from-gray-200/80 to-gray-300/60';
      case 'gold': return 'bg-gradient-to-br from-yellow-200/80 to-yellow-300/60';
      case 'platinum': return 'bg-gradient-to-br from-blue-200/80 to-blue-300/60';
      case 'emerald': return 'bg-gradient-to-br from-green-200/80 to-green-300/60';
      case 'ruby': return 'bg-gradient-to-br from-red-200/80 to-red-300/60';
      case 'diamond': return 'bg-gradient-to-br from-purple-200/80 to-purple-300/60';
      case 'black': return 'bg-gradient-to-br from-gray-700/80 to-gray-800/60';
      default: return 'bg-gradient-to-br from-gray-200/80 to-gray-300/60';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'silver': return '🛡️';
      case 'gold': return '🏅';
      case 'platinum': return '⚡';
      case 'emerald': return '💎';
      case 'ruby': return '⭐';
      case 'diamond': return '👑';
      case 'black': return '⚫';
      default: return '🔶';
    }
  };

  return (
    <div className="min-h-screen bg-paygo-lavender">
      {/* Header */}
      <div className="glass-header text-white p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Level Benefits</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Level Card */}
        <div className={`${getLevelBackgroundColor(levelName)} backdrop-blur-sm rounded-2xl p-6 border border-white/30`}>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 glass-card rounded-full flex items-center justify-center">
              <span className="text-2xl">{getLevelIcon(levelName)}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{levelName} Level</h2>
              <p className="text-xl font-semibold text-foreground">{price}</p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-bold text-primary mb-6">Benefits & Features</h3>
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full gradient-purple flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={onProceedToPayment}
          className="w-full h-14 gradient-purple hover:opacity-90 text-white text-lg font-medium rounded-xl"
        >
          Proceed to Payment
        </Button>

        <p className="text-center text-muted-foreground text-sm">
          Your upgrade will be activated immediately after payment is confirmed
        </p>
      </div>
    </div>
  );
};

export default LevelBenefits;
