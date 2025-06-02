
import React from 'react';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PayIdSuccessProps {
  onBack: () => void;
}

const PayIdSuccess: React.FC<PayIdSuccessProps> = ({ onBack }) => {
  const payId = 'PAY200717';

  const handleCopy = () => {
    navigator.clipboard.writeText(payId);
  };

  const handleContinueToDashboard = () => {
    // Navigate back to dashboard
    onBack();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">PAY ID Confirmed</h1>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8">
          <Check className="w-12 h-12 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Payment Confirmed!
        </h2>

        <p className="text-gray-600 text-center mb-8">
          Your PAY ID has been successfully generated
        </p>

        {/* PAY ID Display */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 w-full max-w-sm">
          <p className="text-center text-gray-600 mb-2">Your PAY ID</p>
          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
            <span className="text-2xl font-bold text-purple-600">{payId}</span>
            <Button 
              onClick={handleCopy}
              className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-center text-gray-500 text-sm mt-3">
            Use this PAY ID for airtime/data purchases and withdrawals
          </p>
        </div>

        <Button 
          onClick={handleContinueToDashboard}
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

export default PayIdSuccess;
