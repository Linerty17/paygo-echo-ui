
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface PaymentConfirmationProps {
  onBack: () => void;
  onComplete: () => void;
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({ onBack, onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => onComplete(), 1000);
          return 100;
        }
        return prevProgress + 20;
      });
    }, 800);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Confirming Payment</h1>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
        {/* Loading Spinner */}
        <div className="w-24 h-24 mb-8">
          <div className="animate-spin rounded-full h-24 w-24 border-4 border-orange-200 border-t-orange-500"></div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Confirming Your Payment
        </h2>

        <p className="text-gray-600 text-center mb-8 max-w-sm">
          Please wait while we verify your transaction...
        </p>

        {/* Progress Bar */}
        <div className="w-full max-w-md mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        <div className="text-center space-y-2">
          <p className="text-gray-600">This may take a few moments</p>
          <p className="text-gray-600">Please do not close this page</p>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-900 font-semibold">PayGo Financial Services LTD</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
