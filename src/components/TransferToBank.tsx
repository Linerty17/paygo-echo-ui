
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TransferToBankProps {
  onBack: () => void;
  onTransferComplete: (amount: string) => void;
  currentBalance: string;
}

const TransferToBank: React.FC<TransferToBankProps> = ({ onBack, onTransferComplete, currentBalance }) => {
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [accountName, setAccountName] = useState('');
  const [payIdCode, setPayIdCode] = useState('');

  const banks = [
    'Access Bank', 'Zenith Bank', 'GTBank', 'First Bank', 'UBA', 'Ecobank',
    'Fidelity Bank', 'FCMB', 'Sterling Bank', 'Stanbic IBTC', 'Union Bank',
    'Wema Bank', 'Heritage Bank', 'Keystone Bank', 'Polaris Bank', 'Unity Bank',
    'Jaiz Bank', 'SunTrust Bank', 'Providus Bank', 'Titan Trust Bank',
    'Mobley', 'Kuda', 'VBank', 'Moniepoint', 'Palmpay', 'Opay'
  ];

  const handleTransfer = () => {
    if (!selectedBank || !accountNumber || !amount || !accountName || !payIdCode) {
      alert('Please fill all fields');
      return;
    }

    if (payIdCode !== 'PAY7252276') {
      alert('Invalid PAY ID Code. Please enter a valid PAY ID to proceed with withdrawal.');
      return;
    }

    const transferAmount = parseFloat(amount.replace(/[₦,]/g, ''));
    const currentBalanceAmount = parseFloat(currentBalance.replace(/[₦,]/g, ''));

    if (transferAmount > currentBalanceAmount) {
      alert('Insufficient balance');
      return;
    }

    onTransferComplete(`₦${transferAmount.toLocaleString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Transfer to Bank</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Balance Display */}
        <div className="bg-purple-600 text-white p-6 rounded-2xl">
          <p className="text-sm opacity-90">Available Balance</p>
          <p className="text-3xl font-bold">{currentBalance}</p>
        </div>

        {/* Bank Selection */}
        <div>
          <label className="block text-gray-700 mb-2">Select Bank</label>
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className="w-full h-14 px-4 bg-white border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="">Choose a bank</option>
            {banks.map((bank) => (
              <option key={bank} value={bank}>{bank}</option>
            ))}
          </select>
        </div>

        {/* Account Number */}
        <div>
          <label className="block text-gray-700 mb-2">Account Number</label>
          <Input
            type="text"
            placeholder="Enter account number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full h-14 text-lg border-0 bg-white rounded-xl shadow-sm"
          />
        </div>

        {/* Account Name */}
        <div>
          <label className="block text-gray-700 mb-2">Account Name</label>
          <Input
            type="text"
            placeholder="Enter account name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className="w-full h-14 text-lg border-0 bg-white rounded-xl shadow-sm"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-gray-700 mb-2">Amount</label>
          <Input
            type="text"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full h-14 text-lg border-0 bg-white rounded-xl shadow-sm"
          />
        </div>

        {/* PAY ID Code */}
        <div>
          <label className="block text-gray-700 mb-2">PAY ID Code</label>
          <Input
            type="text"
            placeholder="Enter PAY ID Code"
            value={payIdCode}
            onChange={(e) => setPayIdCode(e.target.value)}
            className="w-full h-14 text-lg border-0 bg-white rounded-xl shadow-sm"
          />
          <p className="text-gray-500 text-sm mt-2">Enter your PAY ID code to authorize withdrawal</p>
        </div>

        <Button 
          onClick={handleTransfer}
          className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium rounded-xl mt-8"
        >
          Transfer Money
        </Button>
      </div>
    </div>
  );
};

export default TransferToBank;
