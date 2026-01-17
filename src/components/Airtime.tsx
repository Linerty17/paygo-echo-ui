import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Phone } from 'lucide-react';
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

  const networks = [
    { name: 'Airtel', gradient: 'from-red-500 to-red-600' },
    { name: 'MTN', gradient: 'from-yellow-500 to-amber-600' },
    { name: 'Glo', gradient: 'from-green-500 to-emerald-600' },
    { name: '9mobile', gradient: 'from-green-600 to-teal-600' }
  ];
  
  const amounts = [
    { amount: '₦50', cashback: '₦1' },
    { amount: '₦100', cashback: '₦2' },
    { amount: '₦200', cashback: '₦3' },
    { amount: '₦500', cashback: '₦10' },
    { amount: '₦1000', cashback: '₦20' },
    { amount: '₦2000', cashback: '₦50' },
    { amount: '₦3000', cashback: '₦75' },
    { amount: '₦5000', cashback: '₦125' },
    { amount: '₦10000', cashback: '₦250' }
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

    onPurchaseSuccess(selectedAmount, phoneNumber);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="glass w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10 hover:border-primary/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Buy Airtime</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Bonus Banner */}
      <div className="mx-4 mb-4">
        <div className="relative overflow-hidden glass rounded-2xl p-4 border border-primary/20">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-lavender flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-foreground font-medium">Airtime Bonuses!</p>
                <p className="text-muted-foreground text-sm">Get cashback on every purchase</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-8 space-y-5">
        {/* Network Selection */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Select Network</h3>
          <div className="grid grid-cols-4 gap-2">
            {networks.map((network) => (
              <button
                key={network.name}
                onClick={() => setSelectedNetwork(network.name)}
                className={`glass rounded-2xl p-3 text-center border-2 transition-all duration-300 hover:scale-105 ${
                  selectedNetwork === network.name 
                    ? 'border-primary shadow-lg shadow-primary/20' 
                    : 'border-transparent'
                }`}
              >
                <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${network.gradient} flex items-center justify-center mb-2`}>
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs font-medium text-foreground">{network.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Phone Number Input */}
        <div>
          <label className="block text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Phone Number</label>
          <Input
            type="tel"
            placeholder="Enter mobile number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full h-14 text-lg glass border border-white/10 rounded-2xl placeholder:text-muted-foreground focus:border-primary/50"
          />
        </div>

        {/* Amount Selection */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Select Amount</h3>
          <div className="grid grid-cols-3 gap-2">
            {amounts.map((item, index) => (
              <button
                key={index}
                onClick={() => setSelectedAmount(item.amount)}
                className={`glass rounded-2xl p-3 text-center border-2 transition-all duration-300 hover:scale-105 ${
                  selectedAmount === item.amount 
                    ? 'border-primary shadow-lg shadow-primary/20' 
                    : 'border-transparent'
                }`}
              >
                <div className="font-bold text-foreground">{item.amount}</div>
                <div className="text-xs text-primary font-medium">+{item.cashback}</div>
              </button>
            ))}
          </div>
        </div>

        {/* PAY ID Code Input */}
        <div>
          <label className="block text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">PAY ID Code</label>
          <Input
            type="text"
            placeholder="Enter PAY ID Code"
            value={payIdCode}
            onChange={(e) => setPayIdCode(e.target.value)}
            className="w-full h-14 text-lg glass border border-white/10 rounded-2xl placeholder:text-muted-foreground focus:border-primary/50"
          />
          <p className="text-muted-foreground text-xs mt-2">Enter your PAY ID code to purchase airtime</p>
        </div>

        <Button 
          onClick={handleBuyAirtime}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-lavender hover:opacity-90 text-white text-lg font-semibold shadow-lg shadow-primary/30 border-0 mt-4"
        >
          Buy Airtime
        </Button>
      </div>
    </div>
  );
};

export default Airtime;
