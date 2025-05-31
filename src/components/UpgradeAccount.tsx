
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UpgradeAccountProps {
  onBack: () => void;
}

const UpgradeAccount: React.FC<UpgradeAccountProps> = ({ onBack }) => {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const levels = [
    { name: 'Silver', price: '₦5,500', icon: '🔶' },
    { name: 'Gold', price: '₦7,500', icon: '🏆' },
    { name: 'Platinum', price: '₦10,000', icon: '⚡' },
    { name: 'Emerald', price: '₦15,000', icon: '💎' },
    { name: 'Ruby', price: '₦20,000', icon: '⭐' },
    { name: 'Diamond', price: '₦25,000', icon: '👑' },
    { name: 'Black', price: '₦50,000', icon: '🔷' }
  ];

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
          <div className="grid grid-cols-3 gap-3">
            {levels.map((level) => (
              <button
                key={level.name}
                onClick={() => setSelectedLevel(level.name)}
                className={`bg-white rounded-xl p-4 shadow-sm text-center border-2 transition-colors ${
                  selectedLevel === level.name ? 'border-purple-600' : 'border-transparent'
                }`}
              >
                <div className="text-2xl mb-2">{level.icon}</div>
                <p className="font-semibold text-gray-900">{level.name}</p>
                <p className="text-sm text-gray-600">{level.price}</p>
              </button>
            ))}
          </div>
        </div>

        <Button className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium rounded-xl mt-8">
          View Benefits
        </Button>

        <p className="text-center text-gray-600 text-sm">
          Select a level to view detailed benefits before payment
        </p>
      </div>
    </div>
  );
};

export default UpgradeAccount;
