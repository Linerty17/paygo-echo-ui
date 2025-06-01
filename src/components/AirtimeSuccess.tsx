
import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AirtimeSuccessProps {
  onBack: () => void;
  phoneNumber: string;
  amount: string;
  network: string;
}

const AirtimeSuccess: React.FC<AirtimeSuccessProps> = ({ onBack, phoneNumber, amount, network }) => {
  const getCurrentDate = () => {
    const now = new Date();
    return `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      {/* Success Icon */}
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-purple-600 rounded-full flex items-center justify-center">
          <Check className="w-16 h-16 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center">
          <span className="text-2xl">🎉</span>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-purple-600 mb-8 text-center">
        Airtime Purchase Successful!
      </h1>

      {/* Transaction Details */}
      <div className="bg-gray-100 rounded-2xl p-6 mb-8 w-full max-w-sm">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Phone Number</span>
            <span className="font-semibold">{phoneNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount</span>
            <span className="font-semibold">{amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Network</span>
            <span className="font-semibold">{network}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date</span>
            <span className="font-semibold">{getCurrentDate()}</span>
          </div>
        </div>
      </div>

      <Button 
        onClick={onBack}
        className="w-full max-w-sm h-14 bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium rounded-xl"
      >
        Back to Dashboard
      </Button>
    </div>
  );
};

export default AirtimeSuccess;
