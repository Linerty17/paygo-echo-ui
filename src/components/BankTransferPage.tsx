
import React, { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface BankTransferPageProps {
  onBack: () => void;
  onTransferConfirmed: () => void;
}

const BankTransferPage: React.FC<BankTransferPageProps> = ({ onBack, onTransferConfirmed }) => {
  const [showServiceNotice, setShowServiceNotice] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleTransferConfirmed = () => {
    setShowServiceNotice(true);
  };

  const handleUnderstand = () => {
    setShowServiceNotice(false);
    onTransferConfirmed();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={onBack}>
              <ArrowLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Bank Transfer</h1>
          </div>
          <button className="text-red-500 font-medium">Cancel</button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* User Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-gray-600">support1@gmail.com</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">NGN 7,250</p>
          </div>
        </div>

        <div className="text-center py-4">
          <p className="text-gray-900 font-medium">
            Proceed to your bank app to complete this Transfer
          </p>
        </div>

        {/* Transfer Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Amount</p>
              <p className="text-xl font-bold text-gray-900">NGN 7,250</p>
            </div>
            <Button 
              onClick={() => handleCopy('7250')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
            >
              Copy
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Account Number</p>
              <p className="text-xl font-bold text-gray-900">5569742889</p>
            </div>
            <Button 
              onClick={() => handleCopy('5569742889')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
            >
              Copy
            </Button>
          </div>

          <div>
            <p className="text-gray-600 mb-1">Bank Name</p>
            <p className="text-xl font-bold text-gray-900">Moniepoint</p>
          </div>

          <div>
            <p className="text-gray-600 mb-1">Account Name</p>
            <p className="text-xl font-bold text-gray-900">Sunday Liberty</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4">
          <p className="text-center text-gray-900 mb-4">
            Make Payment to the Account Above to get your PAY ID
          </p>
          
          <Button 
            onClick={handleTransferConfirmed}
            className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white text-lg font-medium rounded-xl"
          >
            I have made this bank Transfer
          </Button>
        </div>
      </div>

      {/* Service Notice Dialog */}
      <Dialog open={showServiceNotice} onOpenChange={setShowServiceNotice}>
        <DialogContent className="max-w-sm mx-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold">Service Notice</h3>
              </div>
              <button onClick={() => setShowServiceNotice(false)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-yellow-600">⚠️</span>
                <h4 className="font-semibold text-gray-900">Moniepoint Bank Service Down</h4>
              </div>
              <p className="text-gray-700">
                We're currently experiencing issues with Moniepoint bank transfers. 
                Please use other banks for your payments.
              </p>
            </div>

            <p className="text-gray-700 mb-6">
              We apologize for any inconvenience. All other banks are working normally and 
              your payment will be processed immediately.
            </p>

            <Button 
              onClick={handleUnderstand}
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
            >
              I Understand
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BankTransferPage;
