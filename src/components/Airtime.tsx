
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AirtimeProps {
  onBack: () => void;
  onPurchaseSuccess: (amount: string, phone: string) => void;
}

const Airtime: React.FC<AirtimeProps> = ({ onBack, onPurchaseSuccess }) => {
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedAmount, setSelectedAmount] = useState('');
  const [payIdCode, setPayIdCode] = useState('');

  const networks = ['Airtel', 'MTN', 'Glo', '9mobile'];
  
  const amounts = [
    { amount: '₦50', cashback: '₦1 Cashback' },
    { amount: '₦100', cashback: '₦2 Cashback' },
    { amount: '₦200', cashback: '₦3 Cashback' },
    { amount: '₦500', cashback: '₦10 Cashback' },
    { amount: '₦1000', cashback: '₦20 Cashback' },
    { amount: '₦2000', cashback: '₦50 Cashback' },
    { amount: '₦3000', cashback: '₦75 Cashback' },
    { amount: '₦5000', cashback: '₦125 Cashback' },
    { amount: '₦10000', cashback: '₦250 Cashback' }
  ];

  const handleBuyAirtime = () => {
    if (!selectedNetwork || !phoneNumber || !selectedAmount || !payIdCode) {
      alert('Please fill all fields including PAY ID Code');
      return;
    }
    
    if (payIdCode !== 'PAY4463653') {
      alert('Invalid PAY ID Code');
      return;
    }

    // Call the success callback with purchase details
    onPurchaseSuccess(selectedAmount, phoneNumber);
  };

  return (
    <div className="min-h-screen bg-paygo-lavender">
      {/* Header */}
      <div className="glass-header text-white p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Airtime</h1>
        </div>
      </div>

      {/* Airtime Bonuses Banner */}
      <div className="gradient-purple text-white p-4 flex items-center justify-between">
        <div>
          <span className="text-lg">Enjoy </span>
          <span className="text-purple-200 font-bold">Airtime Bonuses!</span>
        </div>
        <Button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold px-6 py-2 rounded-full">
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
              className={`h-16 glass-card rounded-xl border-2 flex items-center justify-center text-lg font-medium transition-all ${
                selectedNetwork === network ? 'border-primary text-primary' : 'border-transparent text-foreground'
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
            className="w-full h-14 text-lg border-0 glass-input rounded-xl placeholder:text-muted-foreground"
          />
        </div>

        {/* Amount Selection */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Select Amount</h3>
          <div className="grid grid-cols-3 gap-3">
            {amounts.map((item, index) => (
              <button
                key={index}
                onClick={() => setSelectedAmount(item.amount)}
                className={`glass-card rounded-xl p-3 border-2 text-center transition-all ${
                  selectedAmount === item.amount ? 'border-primary' : 'border-transparent'
                }`}
              >
                <div className="font-bold text-lg text-foreground">{item.amount}</div>
                <div className="text-xs text-muted-foreground">{item.cashback}</div>
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
            className="w-full h-14 text-lg border-0 glass-input rounded-xl placeholder:text-muted-foreground"
          />
          <p className="text-muted-foreground text-sm mt-2">Enter your PAY ID code to purchase airtime</p>
        </div>

        <Button 
          onClick={handleBuyAirtime}
          className="w-full h-14 gradient-purple hover:opacity-90 text-white text-lg font-medium rounded-xl mt-8"
        >
          Buy Airtime
        </Button>
      </div>
    </div>
  );
};

export default Airtime;
