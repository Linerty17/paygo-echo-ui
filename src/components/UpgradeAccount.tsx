import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LevelBenefits from './LevelBenefits';

interface UpgradeAccountProps {
  onBack: () => void;
  onProceedToPayment: (levelName: string, price: string) => void;
}

const UpgradeAccount: React.FC<UpgradeAccountProps> = ({ onBack, onProceedToPayment }) => {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [showBenefits, setShowBenefits] = useState(false);

  const levels = [
    { 
      name: 'Silver', 
      price: '₦5,500', 
      icon: '🔶',
      benefits: [
        'Earn ₦500 per referral',
        'Weekly rewards of ₦5,000',
        'Basic customer support',
        'Access to standard features'
      ]
    },
    { 
      name: 'Gold', 
      price: '₦7,500', 
      icon: '🏆',
      benefits: [
        'Earn ₦1,000 per referral',
        'Weekly rewards of ₦10,000',
        'Priority customer support',
        'Reduced fees on transactions',
        'Twice weekly withdrawal option'
      ]
    },
    { 
      name: 'Platinum', 
      price: '₦10,000', 
      icon: '⚡',
      benefits: [
        'Earn ₦2,000 per referral',
        'Weekly rewards of ₦20,000',
        'VIP customer support',
        'No fees on transactions',
        'Exclusive promotions',
        'Daily withdrawal option'
      ]
    },
    { 
      name: 'Emerald', 
      price: '₦15,000', 
      icon: '💎',
      benefits: [
        'Earn ₦3,000 per referral',
        'Weekly rewards of ₦30,000',
        'Premium customer support',
        'No fees on transactions',
        'Exclusive promotions',
        '10% bonus on all earnings'
      ]
    },
    { 
      name: 'Ruby', 
      price: '₦20,000', 
      icon: '⭐',
      benefits: [
        'Earn ₦4,000 per referral',
        'Weekly rewards of ₦40,000',
        'Premium customer support',
        'No fees on transactions',
        '15% bonus on all earnings',
        'Exclusive investment opportunities'
      ]
    },
    { 
      name: 'Diamond', 
      price: '₦25,000', 
      icon: '👑',
      benefits: [
        'Earn ₦5,000 per referral',
        'Weekly rewards of ₦50,000',
        '24/7 dedicated support',
        'No fees on transactions',
        'Higher withdrawal limits',
        'Early access to new features'
      ]
    },
    { 
      name: 'Black', 
      price: '₦50,000', 
      icon: '🔷',
      benefits: [
        'Earn ₦10,000 per referral',
        'Weekly rewards of ₦100,000',
        'Personal account manager',
        'No fees on transactions',
        'Unlimited withdrawal limits',
        '25% bonus on all earnings',
        'Exclusive offline events access'
      ]
    }
  ];

  const handleLevelSelect = (level: typeof levels[0]) => {
    setSelectedLevel(level.name);
    setShowBenefits(true);
  };

  const handleProceedToPayment = () => {
    const level = levels.find(l => l.name === selectedLevel);
    if (level) {
      onProceedToPayment(level.name, level.price);
    }
  };

  if (showBenefits && selectedLevel) {
    const level = levels.find(l => l.name === selectedLevel);
    if (level) {
      return (
        <LevelBenefits
          onBack={() => setShowBenefits(false)}
          levelName={level.name}
          price={level.price}
          icon={level.icon}
          benefits={level.benefits}
          onProceedToPayment={handleProceedToPayment}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Upgrade Account</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Level</h2>
          <p className="text-gray-600">Select a level to view benefits and upgrade</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600">🏅</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Level</p>
              <p className="text-lg font-semibold text-gray-900">Basic</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Level to Upgrade</h3>
          <div className="grid grid-cols-2 gap-3">
            {levels.map((level) => (
              <button
                key={level.name}
                onClick={() => handleLevelSelect(level)}
                className={`bg-white rounded-xl p-4 shadow-sm text-center border-2 transition-colors ${
                  selectedLevel === level.name ? 'border-purple-600' : 'border-transparent'
                }`}
              >
                <div className="text-2xl mb-2">{level.icon}</div>
                <p className="font-semibold text-gray-900 text-sm">{level.name}</p>
                <p className="text-lg font-bold text-purple-600">{level.price}</p>
                <p className="text-xs text-gray-500 mt-1">Pay this amount</p>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm">
          Each level has its own payment amount. Select to view benefits and proceed to payment.
        </p>
      </div>
    </div>
  );
};

export default UpgradeAccount;
