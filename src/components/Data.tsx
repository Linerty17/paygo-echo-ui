
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DataProps {
  onBack: () => void;
  onDataPurchaseSuccess: () => void;
}

const Data: React.FC<DataProps> = ({ onBack, onDataPurchaseSuccess }) => {
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [payIdCode, setPayIdCode] = useState('');

  const networks = ['Airtel', 'MTN', 'Glo', '9mobile'];
  
  const dataPlans = [
    { amount: '₦100', data: '300MB', validity: '1 DAY' },
    { amount: '₦300', data: '1GB', validity: '7 DAYS' },
    { amount: '₦500', data: '3GB', validity: '30 DAYS' },
    { amount: '₦800', data: '5GB', validity: '30 DAYS' },
    { amount: '₦1500', data: '10GB', validity: '30 DAYS' },
  ];

  const handleBuyData = () => {
    if (!selectedNetwork || !phoneNumber || !selectedPlan || !payIdCode) {
      alert('Please fill all fields including PAY ID Code');
      return;
    }
    
    if (payIdCode !== 'PAY200717') {
      alert('Invalid PAY ID Code');
      return;
    }

    onDataPurchaseSuccess();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Data</h1>
        </div>
      </div>

      {/* Data Bonuses Banner */}
      <div className="bg-green-500 text-white p-4 flex items-center justify-between">
        <div>
          <span className="text-lg">Enjoy </span>
          <span className="text-yellow-300 font-bold">Glo's Amazing 5X Data Bonuses!</span>
        </div>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-2 rounded-full">
          GO
        </Button>
      </div>

      <div className="p-6 space-y-6">
        {/* Network Selection */}
        <div className="grid grid-cols-2 gap-3">
          {networks.map((network) => (
            <button
              key={network}
              onClick={() => setSelectedNetwork(network)}
              className={`h-16 bg-white rounded-xl shadow-sm border-2 flex items-center justify-center text-lg font-medium transition-colors ${
                selectedNetwork === network ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-900'
              }`}
            >
              {network}
            </button>
          ))}
        </div>

        {/* Phone Number Input */}
        <div>
          <Input
            type="tel"
            placeholder="Enter mobile number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full h-14 text-lg border-0 bg-white rounded-xl shadow-sm placeholder:text-gray-400"
          />
        </div>

        {/* Data Plan Selection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Data Plan</h3>
          <div className="grid grid-cols-3 gap-3">
            {dataPlans.map((plan, index) => (
              <button
                key={index}
                onClick={() => setSelectedPlan(plan.amount)}
                className={`bg-white rounded-xl p-3 shadow-sm border-2 text-center transition-colors ${
                  selectedPlan === plan.amount ? 'border-purple-600' : 'border-transparent'
                }`}
              >
                <div className="font-bold text-lg text-gray-900">{plan.amount}</div>
                <div className="text-sm text-gray-600">{plan.data}</div>
                <div className="text-xs text-gray-500">{plan.validity}</div>
              </button>
            ))}
          </div>
        </div>

        {/* PAY ID Code Input */}
        <div>
          <Input
            type="text"
            placeholder="Enter PAY ID Code"
            value={payIdCode}
            onChange={(e) => setPayIdCode(e.target.value)}
            className="w-full h-14 text-lg border-0 bg-white rounded-xl shadow-sm placeholder:text-gray-400"
          />
          <p className="text-gray-500 text-sm mt-2">Enter your PAY ID code to purchase data</p>
        </div>

        <Button 
          onClick={handleBuyData}
          className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium rounded-xl mt-8"
        >
          Buy Data
        </Button>
      </div>
    </div>
  );
};

export default Data;
