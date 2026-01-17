
import React, { useState } from 'react';
import { ArrowLeft, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BankTransferPageProps {
  onBack: () => void;
  onTransferConfirmed: () => void;
  userEmail: string;
  amount?: string;
  levelName?: string;
}

const BankTransferPage: React.FC<BankTransferPageProps> = ({ onBack, onTransferConfirmed, userEmail, amount = '₦6,500', levelName }) => {
  const [email, setEmail] = useState(userEmail);
  const [receiptUploaded, setReceiptUploaded] = useState(false);

  const accountDetails = { accountNumber: '6493714067', bankName: 'MONIEPOINT MFB', accountName: 'FELIX MOSES IYALLA' };

  const handleCopyAccount = () => { navigator.clipboard.writeText(accountDetails.accountNumber); alert('Account number copied!'); };
  const handleReceiptUpload = (event: React.ChangeEvent<HTMLInputElement>) => { if (event.target.files?.[0]) setReceiptUploaded(true); };
  const handleConfirmTransfer = () => { if (!receiptUploaded) { alert('Please upload payment receipt'); return; } onTransferConfirmed(); };

  return (
    <div className="min-h-screen bg-paygo-lavender">
      <div className="glass-header text-white p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-xl font-semibold">{levelName ? `${levelName} Level Payment` : 'Bank Transfer'}</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="glass-card border border-primary/30 rounded-xl p-4">
          <p className="text-primary text-sm font-medium">Please transfer the exact amount to the account below and upload your receipt</p>
        </div>

        {levelName && (
          <div className="glass-card border border-primary/20 rounded-xl p-4">
            <p className="text-foreground text-sm font-medium">You are upgrading to <strong>{levelName} Level</strong> - Amount: <strong>{amount}</strong></p>
          </div>
        )}

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Transfer to this account</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-muted-foreground text-sm mb-1">Account Number</label>
              <div className="flex items-center justify-between glass-input rounded-xl p-4">
                <span className="text-lg font-bold text-primary">{accountDetails.accountNumber}</span>
                <Button onClick={handleCopyAccount} className="gradient-purple hover:opacity-90 text-white p-2 rounded-lg"><Copy className="w-4 h-4" /></Button>
              </div>
            </div>
            <div>
              <label className="block text-muted-foreground text-sm mb-1">Bank Name</label>
              <div className="glass-input rounded-xl p-4"><span className="text-lg font-medium text-foreground">{accountDetails.bankName}</span></div>
            </div>
            <div>
              <label className="block text-muted-foreground text-sm mb-1">Account Name</label>
              <div className="glass-input rounded-xl p-4"><span className="text-lg font-medium text-foreground">{accountDetails.accountName}</span></div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-foreground text-lg font-medium mb-3">Amount to Transfer</label>
          <div className="w-full h-14 glass-card rounded-xl flex items-center px-4"><span className="text-xl text-foreground font-bold">{amount}</span></div>
        </div>

        <div>
          <label className="block text-foreground text-lg font-medium mb-3">Your Email Address</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-14 text-lg border-0 glass-input rounded-xl" disabled />
        </div>

        <div>
          <label className="block text-foreground text-lg font-medium mb-3">Upload Payment Receipt</label>
          <div className="border-2 border-dashed border-primary/30 rounded-xl p-6 text-center glass-card">
            <input type="file" accept="image/*" onChange={handleReceiptUpload} className="hidden" id="receipt-upload" />
            <label htmlFor="receipt-upload" className="cursor-pointer">
              {receiptUploaded ? (<div className="text-green-600"><div className="text-2xl mb-2">✓</div><p>Receipt uploaded successfully</p></div>) : (<div className="text-muted-foreground"><div className="text-2xl mb-2">📄</div><p>Tap to upload payment receipt</p></div>)}
            </label>
          </div>
        </div>

        <Button onClick={handleConfirmTransfer} className="w-full h-14 gradient-purple hover:opacity-90 text-white text-lg font-medium rounded-xl mt-8">Confirm Transfer</Button>
        <div className="text-center mt-8"><p className="text-foreground font-semibold">PayGo Financial Services LTD</p></div>
      </div>
    </div>
  );
};

export default BankTransferPage;
