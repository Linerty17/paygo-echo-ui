import React, { useState } from 'react';
import { ArrowLeft, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ACCOUNT_DETAILS } from '@/config/accountDetails';

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

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(ACCOUNT_DETAILS.accountNumber);
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
    <div className="min-h-screen min-h-[100dvh] bg-background w-full overflow-x-hidden">
      {/* Header */}
      <div className="glass-header text-foreground p-4 w-full">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <h1 className="text-xl font-semibold">{levelName} Level Payment</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 w-full max-w-md mx-auto">
        <div className="glass-card rounded-xl p-4 border-primary/30">
          <p className="text-primary text-sm font-medium">
            Please transfer the exact amount to the account below and upload your receipt
          </p>
        </div>

        <div className="glass-card rounded-xl p-4">
          <p className="text-foreground text-sm font-medium">
            You are upgrading to <strong className="text-primary">{levelName} Level</strong> - Amount: <strong className="text-primary">{amount}</strong>
          </p>
        </div>

        {/* Bank Account Details */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Transfer to this account</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-muted-foreground text-sm mb-1">Account Number</label>
              <div className="flex items-center justify-between glass rounded-xl p-4">
                <span className="text-lg font-bold text-primary">{ACCOUNT_DETAILS.accountNumber}</span>
                <Button 
                  onClick={handleCopyAccount}
                  className="bg-primary hover:bg-primary/80 text-primary-foreground p-2 rounded-lg"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-muted-foreground text-sm mb-1">Bank Name</label>
              <div className="glass rounded-xl p-4">
                <span className="text-lg font-medium text-foreground">{ACCOUNT_DETAILS.bankName}</span>
              </div>
            </div>

            <div>
              <label className="block text-muted-foreground text-sm mb-1">Account Name</label>
              <div className="glass rounded-xl p-4">
                <span className="text-lg font-medium text-foreground">{ACCOUNT_DETAILS.accountName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-foreground text-lg font-medium mb-3">Amount to Transfer</label>
          <div className="w-full h-14 glass-card rounded-xl flex items-center px-4">
            <span className="text-xl text-foreground font-bold">{amount}</span>
          </div>
        </div>

        {/* Email (Auto-filled) */}
        <div>
          <label className="block text-foreground text-lg font-medium mb-3">Your Email Address</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-14 text-lg glass-input rounded-xl"
            disabled
          />
        </div>

        {/* Receipt Upload */}
        <div>
          <label className="block text-foreground text-lg font-medium mb-3">Upload Payment Receipt</label>
          <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center glass">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleReceiptUpload}
              className="hidden" 
              id="receipt-upload"
            />
            <label htmlFor="receipt-upload" className="cursor-pointer">
              {receiptUploaded ? (
                <div className="text-green-400">
                  <div className="text-2xl mb-2">✓</div>
                  <p>Receipt uploaded successfully</p>
                </div>
              ) : (
                <div className="text-muted-foreground">
                  <div className="text-2xl mb-2">📄</div>
                  <p>Tap to upload payment receipt</p>
                </div>
              )}
            </label>
          </div>
        </div>

        <Button 
          onClick={handleConfirmTransfer}
          className="w-full h-14 bg-primary hover:bg-primary/80 text-primary-foreground text-lg font-medium rounded-xl mt-8 lavender-glow"
        >
          Confirm Transfer
        </Button>

        <div className="text-center mt-8">
          <p className="text-foreground font-semibold">PayGo Financial Services LTD</p>
        </div>
      </div>
    </div>
  );
};

export default UpgradePaymentPage;
