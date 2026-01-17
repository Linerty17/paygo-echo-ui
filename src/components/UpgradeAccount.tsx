import React, { useState } from 'react';
import { ArrowLeft, Crown, Sparkles, Star } from 'lucide-react';
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
      gradient: 'from-slate-400 to-gray-500',
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
      gradient: 'from-yellow-500 to-amber-600',
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
      gradient: 'from-violet-500 to-purple-600',
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
      gradient: 'from-emerald-500 to-teal-600',
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
      gradient: 'from-red-500 to-rose-600',
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
      gradient: 'from-cyan-500 to-blue-600',
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
      gradient: 'from-gray-800 to-black',
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
    <div className="min-h-screen bg-background">
      {/* Modern Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="glass w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10 hover:border-primary/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Upgrade Account</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-4 pb-8 space-y-5">
        {/* Current Level Card */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-lavender/10 to-primary/5 rounded-3xl" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          
          <div className="relative glass rounded-3xl p-5 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-lavender flex items-center justify-center shadow-lg shadow-primary/30">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Current Level</p>
                <h2 className="text-xl font-bold text-foreground">Basic</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Options */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Choose Level</h3>
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {levels.map((level) => (
              <button
                key={level.name}
                onClick={() => handleLevelSelect(level)}
                className={`group glass rounded-2xl p-4 text-center border-2 transition-all duration-300 hover:scale-105 ${
                  selectedLevel === level.name 
                    ? 'border-primary shadow-lg shadow-primary/20' 
                    : 'border-transparent'
                }`}
              >
                <div className={`w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br ${level.gradient} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className="text-xl">{level.icon}</span>
                </div>
                <p className="font-semibold text-foreground text-sm">{level.name}</p>
                <p className="text-lg font-bold text-primary mt-1">{level.price}</p>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-muted-foreground text-sm">
          Tap any level to view benefits and upgrade
        </p>
      </div>
    </div>
  );
};

export default UpgradeAccount;
