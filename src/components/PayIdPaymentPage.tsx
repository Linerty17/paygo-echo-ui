import React, { useEffect, useState } from 'react';
import { ArrowLeft, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAccountDetails } from '@/hooks/useAccountDetails';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface PayIdPaymentPageProps {
  onBack: () => void;
  onTransferConfirmed: () => void;
  userId: string;
  userEmail: string;
  userName: string;
}

const PayIdPaymentPage: React.FC<PayIdPaymentPageProps> = ({
  onBack,
  onTransferConfirmed,
  userId,
  userEmail,
  userName,
}) => {
  const [email] = useState(userEmail);
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [hasPending, setHasPending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { accountDetails } = useAccountDetails();

  const amount = '₦7,700';
  const amountValue = 7700;

  const checkPendingPayment = async () => {
    if (!userId) {
      setCheckingStatus(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('payment_uploads')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .in('payment_type', ['payid_online', 'payid_offline'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setHasPending(!!data);
    } catch (error) {
      console.error('Error checking pending payment:', error);
      // If the check fails, we still let the user proceed (but insert will be guarded too).
      setHasPending(false);
    } finally {
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    checkPendingPayment();

    if (!userId) return;
    const channel = supabase
      .channel(`payid_offline_guard_${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payment_uploads', filter: `user_id=eq.${userId}` },
        () => {
          checkPendingPayment();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(accountDetails.accountNumber);
    toast({
      title: 'Copied',
      description: 'Account number copied to clipboard',
    });
  };

  const handleReceiptUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Basic client-side validation
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please upload an image (PNG/JPG).',
        variant: 'destructive',
      });
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 10MB.',
        variant: 'destructive',
      });
      return;
    }

    setReceiptFile(file);
    setReceiptUploaded(true);
  };

  const handleConfirmTransfer = async () => {
    if (hasPending) {
      toast({
        title: 'Payment Pending',
        description: 'Please wait till your pending payment is approved before trying again.',
        variant: 'destructive',
      });
      return;
    }

    if (!receiptFile) {
      toast({
        title: 'Receipt needed',
        description: 'Please upload your payment receipt first.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      // Re-check to prevent race conditions / multiple uploads
      const { data: pendingData, error: pendingError } = await supabase
        .from('payment_uploads')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .in('payment_type', ['payid_online', 'payid_offline'])
        .limit(1)
        .maybeSingle();

      if (pendingError) throw pendingError;
      if (pendingData) {
        setHasPending(true);
        toast({
          title: 'Payment Pending',
          description: 'Please wait till your pending payment is approved before uploading again.',
          variant: 'destructive',
        });
        return;
      }

      // Upload receipt image to storage
      const fileExt = receiptFile.name.split('.').pop() || 'jpg';
      const fileName = `${userId}/payid_offline_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-screenshots')
        .upload(fileName, receiptFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('payment-screenshots')
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from('payment_uploads')
        .insert({
          user_id: userId,
          user_name: userName,
          user_email: userEmail,
          payment_type: 'payid_offline',
          amount: amountValue,
          screenshot_url: publicUrl,
          status: 'pending',
        });

      if (insertError) throw insertError;

      toast({
        title: 'Receipt Uploaded!',
        description: 'Your offline payment proof has been sent for verification.',
      });

      onTransferConfirmed();
    } catch (error) {
      console.error('Offline PAY ID upload error:', error);
      toast({
        title: 'Upload Failed',
        description: 'Could not submit your receipt. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (hasPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md glass-card rounded-2xl p-5 border border-border/50 space-y-3">
          <h1 className="text-xl font-bold text-foreground">Payment Pending</h1>
          <p className="text-sm text-muted-foreground">
            You already have a pending PAY ID payment. Please wait till it is approved to avoid multiple uploads.
          </p>
          <Button className="w-full" onClick={onBack}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background w-full overflow-x-hidden">
      {/* Header */}
      <div className="glass-header text-foreground p-4 w-full">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <h1 className="text-xl font-semibold">PAY ID Payment</h1>
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
            You are purchasing a <strong className="text-primary">PAY ID</strong> for{' '}
            <strong>{userName}</strong> - Amount: <strong className="text-primary">{amount}</strong>
          </p>
        </div>

        {/* Bank Account Details */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Transfer to this account</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-muted-foreground text-sm mb-1">Account Number</label>
              <div className="flex items-center justify-between glass rounded-xl p-4">
                <span className="text-lg font-bold text-primary">{accountDetails.accountNumber}</span>
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
                <span className="text-lg font-medium text-foreground">{accountDetails.bankName}</span>
              </div>
            </div>

            <div>
              <label className="block text-muted-foreground text-sm mb-1">Account Name</label>
              <div className="glass rounded-xl p-4">
                <span className="text-lg font-medium text-foreground">{accountDetails.accountName}</span>
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
            onChange={() => {}}
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
              disabled={submitting}
            />
            <label htmlFor="receipt-upload" className={`cursor-pointer ${submitting ? 'pointer-events-none opacity-60' : ''}`}>
              {receiptUploaded ? (
                <div className="text-green-400">
                  <div className="text-2xl mb-2">✓</div>
                  <p>Receipt selected</p>
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
          disabled={submitting}
          className="w-full h-14 bg-primary hover:bg-primary/80 text-primary-foreground text-lg font-medium rounded-xl mt-8 lavender-glow"
        >
          {submitting ? 'Submitting...' : 'Confirm Transfer'}
        </Button>

        <div className="text-center mt-8">
          <p className="text-foreground font-semibold">PayGo Financial Services LTD</p>
        </div>
      </div>
    </div>
  );
};

export default PayIdPaymentPage;

