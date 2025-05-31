
import React, { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TransferToBankProps {
  onBack: () => void;
}

const TransferToBank: React.FC<TransferToBankProps> = ({ onBack }) => {
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState('Access Bank');
  const [amount, setAmount] = useState('');
  const [payIdCode, setPayIdCode] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Transfer To Bank</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Bank Details</h2>

        <div className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Account Name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full h-14 text-lg border-0 bg-white rounded-xl shadow-sm placeholder:text-gray-400"
            />
          </div>

          <div>
            <Input
              type="text"
              placeholder="Account Number (10 digits)"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full h-14 text-lg border-0 bg-white rounded-xl shadow-sm placeholder:text-gray-400"
              maxLength={10}
            />
          </div>

          <div className="relative">
            <div className="w-full h-14 bg-white rounded-xl shadow-sm flex items-center justify-between px-4 border-0">
              <span className="text-lg text-gray-900">{selectedBank}</span>
              <ChevronDown className="w-5 h-5 text-purple-600" />
            </div>
          </div>

          <div>
            <Input
              type="text"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-14 text-lg border-0 bg-white rounded-xl shadow-sm placeholder:text-gray-400"
            />
          </div>

          <div>
            <Input
              type="text"
              placeholder="PAY ID CODE (Buy PAY ID)"
              value={payIdCode}
              onChange={(e) => setPayIdCode(e.target.value)}
              className="w-full h-14 text-lg border-0 bg-white rounded-xl shadow-sm placeholder:text-gray-400"
            />
          </div>

          <div className="mt-4">
            <span className="text-purple-600 font-medium">Buy PAY ID code</span>
          </div>

          <div className="mt-6">
            <p className="text-xl font-bold text-gray-900">Available Balance: ₦180,000.00</p>
          </div>

          <Button className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium rounded-xl mt-8">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransferToBank;
