import React, { useState, useEffect } from 'react';
import { ArrowLeft, Building2, ArrowUpRight, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

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
  const [userPayId, setUserPayId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPayId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('payment_uploads')
          .select('payid_code')
          .eq('user_id', user.id)
          .eq('status', 'approved')
          .neq('payid_status', 'revoked')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (data?.payid_code) {
          setUserPayId(data.payid_code);
        }
      }
    };
    fetchUserPayId();
  }, []);

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

    if (!userPayId || payIdCode !== userPayId) {
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
          <h1 className="text-lg font-semibold text-foreground">Transfer to Bank</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-4 pb-8 space-y-5">
        {/* Balance Card */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-lavender/10 to-primary/5 rounded-3xl" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          
          <div className="relative glass rounded-3xl p-5 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Available Balance</p>
                <p className="text-3xl font-bold text-foreground mt-1">{currentBalance}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-lavender flex items-center justify-center shadow-lg shadow-primary/30">
                <Wallet className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Bank Selection */}
        <div>
          <label className="block text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Select Bank</label>
          <div className="relative">
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full h-14 px-4 glass border border-white/10 rounded-2xl text-base focus:outline-none focus:border-primary/50 text-foreground bg-transparent appearance-none cursor-pointer"
            >
              <option value="" className="bg-background text-foreground">Choose a bank</option>
              {banks.map((bank) => (
                <option key={bank} value={bank} className="bg-background text-foreground">{bank}</option>
              ))}
            </select>
            <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Account Number */}
        <div>
          <label className="block text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Account Number</label>
          <Input
            type="text"
            placeholder="Enter account number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full h-14 text-lg glass border border-white/10 rounded-2xl placeholder:text-muted-foreground focus:border-primary/50"
          />
        </div>

        {/* Account Name */}
        <div>
          <label className="block text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Account Name</label>
          <Input
            type="text"
            placeholder="Enter account name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className="w-full h-14 text-lg glass border border-white/10 rounded-2xl placeholder:text-muted-foreground focus:border-primary/50"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Amount</label>
          <Input
            type="text"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full h-14 text-lg glass border border-white/10 rounded-2xl placeholder:text-muted-foreground focus:border-primary/50"
          />
        </div>

        {/* PAY ID Code */}
        <div>
          <label className="block text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">PAY ID Code</label>
          <Input
            type="text"
            placeholder="Enter PAY ID Code"
            value={payIdCode}
            onChange={(e) => setPayIdCode(e.target.value)}
            className="w-full h-14 text-lg glass border border-white/10 rounded-2xl placeholder:text-muted-foreground focus:border-primary/50"
          />
          <p className="text-muted-foreground text-xs mt-2">Enter your PAY ID code to authorize withdrawal</p>
        </div>

        <Button 
          onClick={handleTransfer}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-lavender hover:opacity-90 text-white text-lg font-semibold shadow-lg shadow-primary/30 border-0 mt-4"
        >
          <ArrowUpRight className="w-5 h-5 mr-2" />
          Transfer Money
        </Button>
      </div>
    </div>
  );
};

export default TransferToBank;
