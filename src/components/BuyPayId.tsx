
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BuyPayIdProps {
  onBack: () => void;
  onPayClicked: () => void;
}

const BuyPayId: React.FC<BuyPayIdProps> = ({ onBack, onPayClicked }) => {
  const [amount, setAmount] = useState('₦7,250');
  const [fullName, setFullName] = useState('Your full name');
  const [email, setEmail] = useState('support1@gmail.com');

  const handlePay = () => {
    if (!fullName || !email) {
      alert('Please fill all fields');
      return;
    }
    onPayClicked();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Buy PAY ID</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label className="block text-gray-900 text-lg font-medium mb-3">Amount</label>
          <div className="w-full h-14 bg-white rounded-xl shadow-sm flex items-center px-4 border-0">
            <span className="text-lg text-gray-500">{amount}</span>
          </div>
        </div>

        <div>
          <label className="block text-gray-900 text-lg font-medium mb-3">Full Name</label>
          <Input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full h-14 text-lg border-0 bg-white rounded-xl shadow-sm"
          />
        </div>

        <div>
          <label className="block text-gray-900 text-lg font-medium mb-3">Your Email Address</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-14 text-lg border-0 bg-white rounded-xl shadow-sm"
          />
        </div>

        <Button 
          onClick={handlePay}
          className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium rounded-xl mt-8"
        >
          Pay
        </Button>

        <p className="text-center text-gray-600 text-sm mt-6">
          Your PAY ID will be displayed on the app once your payment is confirmed.
        </p>

        <div className="text-center mt-12">
          <p className="text-gray-900 font-semibold">PayGo Financial Services LTD</p>
        </div>
      </div>
    </div>
  );
};

export default BuyPayId;
