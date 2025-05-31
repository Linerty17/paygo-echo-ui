
import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PurchaseSuccessProps {
  onBack: () => void;
  type: 'airtime' | 'data';
  amount: string;
  phoneNumber: string;
}

const PurchaseSuccess: React.FC<PurchaseSuccessProps> = ({ onBack, type, amount, phoneNumber }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">{type === 'airtime' ? 'Airtime' : 'Data'} Purchase</h1>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8">
          <Check className="w-12 h-12 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          {type === 'airtime' ? 'Airtime' : 'Data'} Purchase Successful!
        </h2>

        <p className="text-gray-600 text-center mb-8">
          Your {type} has been successfully added to {phoneNumber}
        </p>

        {/* Transaction Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 w-full max-w-sm">
          <p className="text-center text-gray-600 mb-2">Transaction Details</p>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-purple-600">{amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium">{phoneNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="text-green-600 font-medium">Successful</span>
            </div>
          </div>
        </div>

        <Button 
          onClick={onBack}
          className="w-full max-w-sm h-14 bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium rounded-xl"
        >
          Continue to Dashboard
        </Button>

        <div className="mt-16 text-center">
          <p className="text-gray-900 font-semibold">PayGo Financial Services LTD</p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccess;
