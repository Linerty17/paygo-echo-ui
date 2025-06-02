
import React from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaymentFailedProps {
  onBack: () => void;
  onTryAgain: () => void;
  onGoToDashboard: () => void;
}

const PaymentFailed: React.FC<PaymentFailedProps> = ({ onBack, onTryAgain, onGoToDashboard }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Transaction Failed</h1>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
        {/* Error Icon */}
        <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mb-8">
          <X className="w-12 h-12 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-orange-500 mb-4 text-center">
          Transaction verification failed!
        </h2>

        <div className="text-center mb-8 max-w-sm">
          <p className="text-gray-900 font-medium mb-2">Your payment could not be completed.</p>
          <p className="text-gray-900">
            Reason: No Payment received from you/ invalid payment method.
          </p>
        </div>

        {/* Not Available Section */}
        <div className="w-full max-w-sm mb-6">
          <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-between">
            <span className="text-gray-600 text-lg">Not Available</span>
            <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full opacity-60"></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-4">
          <Button 
            onClick={onTryAgain}
            className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium rounded-xl"
          >
            Try Again
          </Button>

          <Button 
            onClick={onGoToDashboard}
            variant="outline"
            className="w-full h-14 bg-white border-2 border-gray-300 text-gray-900 text-lg font-medium rounded-xl hover:bg-gray-50"
          >
            Go to Dashboard
          </Button>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-900 font-semibold">PayGo Financial Services LTD</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
