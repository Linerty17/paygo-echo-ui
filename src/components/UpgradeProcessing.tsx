
import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface UpgradeProcessingProps {
  onBack: () => void;
  onComplete: () => void;
  levelName: string;
  price: string;
}

const UpgradeProcessing: React.FC<UpgradeProcessingProps> = ({ 
  onBack, 
  onComplete, 
  levelName, 
  price 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Processing Upgrade</h1>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center max-w-md w-full">
          <div className="mb-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Details for Payment</h2>
            <p className="text-gray-600">Please wait while we prepare your {levelName} level upgrade...</p>
          </div>

          <div className="bg-purple-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Upgrade Level</p>
            <p className="text-lg font-semibold text-purple-600">{levelName}</p>
            <p className="text-sm text-gray-600 mt-2 mb-1">Amount</p>
            <p className="text-xl font-bold text-gray-900">{price}</p>
          </div>

          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeProcessing;
