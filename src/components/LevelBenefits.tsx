
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
      case 'silver': return 'bg-gray-200';
      case 'gold': return 'bg-yellow-200';
      case 'platinum': return 'bg-blue-200';
      case 'emerald': return 'bg-green-200';
      case 'ruby': return 'bg-red-200';
      case 'diamond': return 'bg-purple-200';
      case 'black': return 'bg-gray-800';
      default: return 'bg-gray-200';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Level Benefits</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Level Card */}
        <div className={`${getLevelBackgroundColor(levelName)} rounded-2xl p-6`}>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl">{getLevelIcon(levelName)}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{levelName} Level</h2>
              <p className="text-xl font-semibold text-gray-900">{price}</p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-purple-600 mb-6">Benefits & Features</h3>
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={onProceedToPayment}
          className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium rounded-xl"
        >
          Proceed to Payment
        </Button>

        <p className="text-center text-gray-600 text-sm">
          Your upgrade will be activated immediately after payment is confirmed
        </p>
      </div>
    </div>
  );
};

export default LevelBenefits;
