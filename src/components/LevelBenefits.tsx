
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
  const getLevelGradient = (level: string) => {
    switch (level.toLowerCase()) {
      case 'silver': return 'from-gray-400/20 to-gray-600/20';
      case 'gold': return 'from-yellow-400/20 to-yellow-600/20';
      case 'platinum': return 'from-blue-400/20 to-blue-600/20';
      case 'emerald': return 'from-green-400/20 to-green-600/20';
      case 'ruby': return 'from-red-400/20 to-red-600/20';
      case 'diamond': return 'from-purple-400/20 to-purple-600/20';
      case 'black': return 'from-gray-700/40 to-gray-900/40';
      default: return 'from-gray-400/20 to-gray-600/20';
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass-header text-foreground p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <h1 className="text-xl font-semibold">Level Benefits</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Level Card */}
        <div className={`glass-card bg-gradient-to-br ${getLevelGradient(levelName)} rounded-2xl p-6 lavender-glow`}>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 glass rounded-full flex items-center justify-center">
              <span className="text-2xl">{getLevelIcon(levelName)}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{levelName} Level</h2>
              <p className="text-xl font-semibold text-primary">{price}</p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-bold text-primary mb-6">Benefits & Features</h3>
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-6 h-6 glass rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="text-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={onProceedToPayment}
          className="w-full h-14 bg-primary hover:bg-primary/80 text-primary-foreground text-lg font-medium rounded-xl lavender-glow"
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
