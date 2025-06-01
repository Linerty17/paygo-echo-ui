
import React, { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TransferToBankProps {
  onBack: () => void;
  onTransferComplete: (amount: string) => void;
  currentBalance: string;
}

const TransferToBank: React.FC<TransferToBankProps> = ({ onBack, onTransferComplete, currentBalance }) => {
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [amount, setAmount] = useState('');
  const [showBankList, setShowBankList] = useState(false);

  const nigerianBanks = [
    'Access Bank',
    'Guaranty Trust Bank (GTBank)',
    'Zenith Bank',
    'First Bank of Nigeria',
    'United Bank for Africa (UBA)',
    'Fidelity Bank',
    'Union Bank',
    'Sterling Bank',
    'Stanbic IBTC Bank',
    'Ecobank',
    'Polaris Bank',
    'Wema Bank',
    'Heritage Bank',
    'Keystone Bank',
    'Unity Bank',
    'Jaiz Bank',
    'Providus Bank',
    'SunTrust Bank',
    'Titan Trust Bank',
    'Parallex Bank',
    'Kuda Bank',
    'Opay',
    'PalmPay',
    'Moniepoint',
    'VFD Microfinance Bank',
    'Mobley Banking App'
  ];

  const handleSubmit = () => {
    if (!accountName || !accountNumber || !selectedBank || !amount) {
      alert('Please fill all fields');
      return;
    }

    const transferAmount = parseFloat(amount.replace(/[₦,]/g, ''));
    const balance = parseFloat(currentBalance.replace(/[₦,]/g, ''));

    if (transferAmount > balance) {
      alert('Insufficient balance');
      return;
    }

    onTransferComplete(amount);
  };

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
            <button
              onClick={() => setShowBankList(!showBankList)}
              className="w-full h-14 bg-white rounded-xl shadow-sm flex items-center justify-between px-4 border-0"
            >
              <span className={`text-lg ${selectedBank ? 'text-gray-900' : 'text-gray-400'}`}>
                {selectedBank || 'Select Bank'}
              </span>
              <ChevronDown className="w-5 h-5 text-purple-600" />
            </button>
            
            {showBankList && (
              <div className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-y-auto z-10 mt-1">
                {nigerianBanks.map((bank) => (
                  <button
                    key={bank}
                    onClick={() => {
                      setSelectedBank(bank);
                      setShowBankList(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl"
                  >
                    {bank}
                  </button>
                ))}
              </div>
            )}
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

          <div className="mt-6">
            <p className="text-xl font-bold text-gray-900">Available Balance: {currentBalance}</p>
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium rounded-xl mt-8"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransferToBank;
