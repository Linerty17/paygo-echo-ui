import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

interface DataProps {
  onBack: () => void;
  onDataPurchaseSuccess: () => void;
}

const Data: React.FC<DataProps> = ({ onBack, onDataPurchaseSuccess }) => {
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [payIdCode, setPayIdCode] = useState('');
  const [globalPayId, setGlobalPayId] = useState<string | null>(null);

  useEffect(() => {
    const fetchGlobalPayId = async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'global_payid')
        .maybeSingle();
      
      if (data?.value) {
        setGlobalPayId(data.value);
      }
    };
    fetchGlobalPayId();
  }, []);

  const networks = [
    { name: 'Airtel', gradient: 'from-red-500 to-red-600' },
    { name: 'MTN', gradient: 'from-yellow-500 to-amber-600' },
    { name: 'Glo', gradient: 'from-green-500 to-emerald-600' },
    { name: '9mobile', gradient: 'from-green-600 to-teal-600' }
  ];
  
  const dataPlans = [
    { amount: '₦100', data: '300MB', validity: '1 Day' },
    { amount: '₦300', data: '1GB', validity: '7 Days' },
    { amount: '₦500', data: '3GB', validity: '30 Days' },
    { amount: '₦800', data: '5GB', validity: '30 Days' },
    { amount: '₦1500', data: '10GB', validity: '30 Days' },
  ];

  const handleBuyData = () => {
    if (!selectedNetwork || !phoneNumber || !selectedPlan || !payIdCode) {
      alert('Please fill all fields including PAY ID Code');
      return;
    }
    
    if (!globalPayId || payIdCode !== globalPayId) {
      alert('Invalid PAY ID Code');
      return;
    }

    onDataPurchaseSuccess();
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
          <h1 className="text-lg font-semibold text-foreground">Buy Data</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Bonus Banner */}
      <div className="mx-4 mb-4">
        <div className="relative overflow-hidden glass rounded-2xl p-4 border border-emerald-500/20">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-foreground font-medium">5X Data Bonuses!</p>
                <p className="text-muted-foreground text-sm">Amazing deals on Glo</p>
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
                  <Wifi className="w-5 h-5 text-white" />
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

        {/* Data Plan Selection */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Select Data Plan</h3>
          <div className="space-y-2">
            {dataPlans.map((plan, index) => (
              <button
                key={index}
                onClick={() => setSelectedPlan(plan.amount)}
                className={`w-full glass rounded-2xl p-4 flex items-center justify-between border-2 transition-all duration-300 ${
                  selectedPlan === plan.amount 
                    ? 'border-primary shadow-lg shadow-primary/20' 
                    : 'border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                    <Wifi className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-foreground">{plan.data}</p>
                    <p className="text-xs text-muted-foreground">{plan.validity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{plan.amount}</p>
                </div>
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
          <p className="text-muted-foreground text-xs mt-2">Enter your PAY ID code to purchase data</p>
        </div>

        <Button 
          onClick={handleBuyData}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-lavender hover:opacity-90 text-white text-lg font-semibold shadow-lg shadow-primary/30 border-0 mt-4"
        >
          Buy Data
        </Button>
      </div>
    </div>
  );
};

export default Data;
