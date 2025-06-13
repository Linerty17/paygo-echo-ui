
import React, { useState } from 'react';
import { ArrowLeft, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UpgradePaymentPageProps {
  onBack: () => void;
  onTransferConfirmed: () => void;
  userEmail: string;
  amount: string;
  levelName: string;
}

const UpgradePaymentPage: React.FC<UpgradePaymentPageProps> = ({ 
  onBack, 
  onTransferConfirmed, 
  userEmail, 
  amount,
  levelName 
}) => {
  const [email, setEmail] = useState(userEmail);
  const [receiptUploaded, setReceiptUploaded] = useState(false);

  const accountDetails = {
    accountNumber: '6028806937',
    bankName: 'MONIEPOINT MFB',
    accountName: 'GIFT GOODLUCK'
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(accountDetails.accountNumber);
    alert('Account number copied!');
  };

  const handleReceiptUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReceiptUploaded(true);
    }
  };

  const handleConfirmTransfer = () => {
    if (!receiptUploaded) {
      alert('Please upload payment receipt');
      return;
    }
    onTransferConfirmed();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">{levelName} Level Payment</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-orange-100 border border-orange-300 rounded-xl p-4">
          <p className="text-orange-800 text-sm font-medium">
            Please transfer the exact amount to the account below and upload your receipt
          </p>
        </div>

        <div className="bg-purple-100 border border-purple-300 rounded-xl p-4">
          <p className="text-purple-800 text-sm font-medium">
            You are upgrading to <strong>{levelName} Level</strong> - Amount: <strong>{amount}</strong>
          </p>
        </div>

        {/* Bank Account Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Transfer to this account</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 text-sm mb-1">Account Number</label>
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <span className="text-lg font-bold text-purple-600">{accountDetails.accountNumber}</span>
                <Button 
                  onClick={handleCopyAccount}
                  className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-1">Bank Name</label>
              <div className="bg-gray-50 rounded-xl p-4">
                <span className="text-lg font-medium">{accountDetails.bankName}</span>
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-1">Account Name</label>
              <div className="bg-gray-50 rounded-xl p-4">
                <span className="text-lg font-medium">{accountDetails.accountName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-gray-900 text-lg font-medium mb-3">Amount to Transfer</label>
          <div className="w-full h-14 bg-white rounded-xl shadow-sm flex items-center px-4 border-0">
            <span className="text-xl text-gray-900 font-bold">{amount}</span>
          </div>
        </div>

        {/* Email (Auto-filled) */}
        <div>
          <label className="block text-gray-900 text-lg font-medium mb-3">Your Email Address</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-14 text-lg border-0 bg-white rounded-xl shadow-sm"
            disabled
          />
        </div>

        {/* Receipt Upload */}
        <div>
          <label className="block text-gray-900 text-lg font-medium mb-3">Upload Payment Receipt</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleReceiptUpload}
              className="hidden" 
              id="receipt-upload"
            />
            <label htmlFor="receipt-upload" className="cursor-pointer">
              {receiptUploaded ? (
                <div className="text-green-600">
                  <div className="text-2xl mb-2">✓</div>
                  <p>Receipt uploaded successfully</p>
                </div>
              ) : (
                <div className="text-gray-600">
                  <div className="text-2xl mb-2">📄</div>
                  <p>Tap to upload payment receipt</p>
                </div>
              )}
            </label>
          </div>
        </div>

        <Button 
          onClick={handleConfirmTransfer}
          className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium rounded-xl mt-8"
        >
          Confirm Transfer
        </Button>

        <div className="text-center mt-8">
          <p className="text-gray-900 font-semibold">PayGo Financial Services LTD</p>
        </div>
      </div>
    </div>
  );
};

export default UpgradePaymentPage;
