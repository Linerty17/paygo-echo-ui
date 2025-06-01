
import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TransferSuccessProps {
  onBack: () => void;
  amount: string;
}

const TransferSuccess: React.FC<TransferSuccessProps> = ({ onBack, amount }) => {
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

      <h1 className="text-3xl font-bold text-purple-600 mb-4 text-center">
        Transfer Successful!
      </h1>

      <p className="text-gray-600 text-center mb-8 text-lg">
        Your transfer of {amount} has been processed successfully.
      </p>

      <div className="bg-pink-100 rounded-2xl px-6 py-3 mb-8">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🎉</span>
          <span className="text-purple-600 font-semibold">Success</span>
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

export default TransferSuccess;
