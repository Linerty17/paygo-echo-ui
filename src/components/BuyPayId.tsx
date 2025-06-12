
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TypewriterText from './TypewriterText';

interface BuyPayIdProps {
  onBack: () => void;
  onPayClicked: () => void;
  userName: string;
  userEmail: string;
}

const BuyPayId: React.FC<BuyPayIdProps> = ({ onBack, onPayClicked, userName, userEmail }) => {
  const [amount] = useState('₦6,500');
  const [showPayButton, setShowPayButton] = useState(false);

  const handleTypewriterComplete = () => {
    setShowPayButton(true);
  };

  const handlePay = () => {
    onPayClicked();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Purchase PAY ID</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-blue-100 border border-blue-300 rounded-xl p-4">
          <p className="text-blue-800 text-sm font-medium">
            Get your unique PAY ID to receive payments easily from other users
          </p>
        </div>

        <div>
          <label className="block text-gray-900 text-lg font-medium mb-3">Amount to Pay</label>
          <div className="w-full h-14 bg-white rounded-xl shadow-sm flex items-center px-4 border-0">
            <span className="text-xl text-purple-600 font-bold">{amount}</span>
          </div>
        </div>

        <div>
          <label className="block text-gray-900 text-lg font-medium mb-3">Full Name</label>
          <div className="w-full h-14 bg-white rounded-xl shadow-sm flex items-center px-4 border-0">
            <span className="text-lg text-gray-900">
              <TypewriterText 
                text={userName} 
                speed={100}
                onComplete={handleTypewriterComplete}
              />
            </span>
          </div>
        </div>

        <div>
          <label className="block text-gray-900 text-lg font-medium mb-3">Your Email Address</label>
          <div className="w-full h-14 bg-white rounded-xl shadow-sm flex items-center px-4 border-0">
            <span className="text-lg text-gray-900">
              <TypewriterText 
                text={userEmail} 
                speed={80}
              />
            </span>
          </div>
        </div>

        {showPayButton && (
          <Button 
            onClick={handlePay}
            className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium rounded-xl mt-8 animate-fade-in"
          >
            Proceed to Payment
          </Button>
        )}

        <div className="bg-green-100 border border-green-300 rounded-xl p-4">
          <h3 className="text-green-800 font-medium mb-2">What is PAY ID?</h3>
          <ul className="text-green-700 text-sm space-y-1">
            <li>• A unique identifier for receiving payments</li>
            <li>• Share with others to receive money instantly</li>
            <li>• One-time purchase, lifetime access</li>
            <li>• Professional payment solution</li>
          </ul>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-900 font-semibold">PayGo Financial Services LTD</p>
        </div>
      </div>
    </div>
  );
};

export default BuyPayId;
