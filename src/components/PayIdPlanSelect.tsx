import React, { useState, useEffect } from 'react';
import { ArrowLeft, Globe, MapPin, Sparkles, Shield, Zap, CreditCard, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import PaymentApprovedScreen from '@/components/screens/PaymentApprovedScreen';

interface PayIdPlanSelectProps {
  onBack: () => void;
  onSelectOnline: () => void;
  onSelectOffline: () => void;
  onTapToUpload: () => void;
  userId?: string;
}

interface PaymentRecord {
  id: string;
  payment_type: string;
  amount: number;
  status: string;
  payid_code: string | null;
  payid_status: string | null;
  created_at: string;
}

const PayIdPlanSelect: React.FC<PayIdPlanSelectProps> = ({ 
  onBack, 
  onSelectOnline, 
  onSelectOffline,
  onTapToUpload,
  userId
}) => {
  const [paymentRecord, setPaymentRecord] = useState<PaymentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [globalPayId, setGlobalPayId] = useState<string>('PAY-4277151111');

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

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        // First check for approved payment with active PAY ID
        const { data: approvedData, error: approvedError } = await supabase
          .from('payment_uploads')
          .select('id, payment_type, amount, status, payid_code, payid_status, created_at')
          .eq('user_id', userId)
          .eq('status', 'approved')
          .in('payment_type', ['payid_online', 'payid_offline'])
          .neq('payid_status', 'revoked')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (approvedData && !approvedError) {
          setPaymentRecord(approvedData);
          setLoading(false);
          return;
        }

        // Then check for pending payment
        const { data: pendingData, error: pendingError } = await supabase
          .from('payment_uploads')
          .select('id, payment_type, amount, status, payid_code, payid_status, created_at')
          .eq('user_id', userId)
          .eq('status', 'pending')
          .in('payment_type', ['payid_online', 'payid_offline'])
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (pendingData && !pendingError) {
          setPaymentRecord(pendingData);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [userId]);

  const handleOnlineClick = () => {
    window.open('https://checkout.nomba.com/payment-link/5947052450', '_blank');
    onSelectOnline();
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show approved PAY ID screen with full-screen animation (use global PAY ID)
  if (!loading && paymentRecord?.status === 'approved' && paymentRecord.payid_status !== 'revoked') {
    return (
      <PaymentApprovedScreen 
        payIdCode={globalPayId}
        onContinue={onBack}
      />
    );
  }

  // Show pending payment screen if exists
  if (!loading && paymentRecord?.status === 'pending') {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-32 w-48 h-48 bg-primary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Header */}
        <div className="relative px-4 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="glass w-10 h-10 rounded-2xl flex items-center justify-center border border-border/50 hover:border-primary/30 hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">Pending Payment</span>
            </div>
            <div className="w-10" />
          </div>
        </div>

        <div className="relative px-4 pb-8 space-y-6">
          {/* Title Section */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-6 h-6 text-amber-500 animate-pulse" />
              <h1 className="text-2xl font-bold text-foreground">Payment Pending</h1>
            </div>
            <p className="text-muted-foreground">You already have a pending payment</p>
          </div>

          {/* Pending Payment Card */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/40 via-orange-500/40 to-amber-500/40 rounded-[28px] blur-xl opacity-50 animate-pulse" />
            
            <div className="relative glass-card rounded-3xl overflow-hidden">
              <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 p-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
                
                <div className="relative text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Awaiting Verification</h2>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Payment Type</span>
                  <span className="text-foreground font-medium">
                    {paymentRecord.payment_type === 'payid_online' ? 'Online Purchase' : 'Offline Purchase'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="text-foreground font-medium">₦{paymentRecord.amount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Submitted</span>
                  <span className="text-foreground font-medium">{formatDate(paymentRecord.created_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 text-sm font-medium">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    Pending
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Alert */}
          <div className="glass-card rounded-2xl p-4 border border-amber-500/30 bg-amber-500/5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-foreground font-medium text-sm">Payment Under Review</p>
                <p className="text-muted-foreground text-xs mt-1">
                  Your payment is being reviewed by our team. You cannot submit a new payment until this one is processed.
                </p>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <Button 
            onClick={onBack}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground text-lg font-semibold shadow-lg border-0"
          >
            Back to Dashboard
          </Button>

          {/* Footer */}
          <div className="text-center pt-2">
            <p className="text-muted-foreground text-sm">You'll be notified when your payment is processed</p>
            <p className="text-foreground font-semibold text-sm mt-2">PayGo Financial Services</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-32 w-48 h-48 bg-accent/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-32 right-1/4 w-56 h-56 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <div className="relative px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="glass w-10 h-10 rounded-2xl flex items-center justify-center border border-border/50 hover:border-primary/30 hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-muted-foreground">Choose Plan</span>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="relative px-4 pb-8 space-y-6">
        {/* Title Section */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            <h1 className="text-2xl font-bold text-foreground">Get Your PAY ID</h1>
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground">Select your preferred payment method</p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Buy Online Card */}
          <button
            onClick={handleOnlineClick}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/50 to-emerald-500/50 rounded-[24px] blur-lg opacity-40 group-hover:opacity-70 transition-opacity" />
            <div className="relative glass-card rounded-3xl p-6 border border-green-500/30 hover:border-green-500/60 transition-all duration-300 h-full flex flex-col items-center justify-center space-y-4 hover:scale-[1.02]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-foreground mb-1">Buy Online</h3>
                <p className="text-2xl font-bold text-green-500">₦7,200</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-green-500">
                <Zap className="w-3.5 h-3.5" />
                <span>Instant</span>
              </div>
            </div>
          </button>

          {/* Buy Offline Card */}
          <button
            onClick={onSelectOffline}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/50 to-orange-500/50 rounded-[24px] blur-lg opacity-40 group-hover:opacity-70 transition-opacity" />
            <div className="relative glass-card rounded-3xl p-6 border border-amber-500/30 hover:border-amber-500/60 transition-all duration-300 h-full flex flex-col items-center justify-center space-y-4 hover:scale-[1.02]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-foreground mb-1">Buy Offline</h3>
                <p className="text-2xl font-bold text-amber-500">₦7,700</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-amber-500">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Bank Transfer</span>
              </div>
            </div>
          </button>
        </div>

        {/* What You Get Section */}
        <div className="glass-card rounded-3xl p-5 border border-border/50">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">What you'll get</p>
          <div className="grid grid-cols-2 gap-3">
            {['Unique PAY ID', 'Instant Rewards', 'Priority Support', 'Full Access'].map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Zap className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Button for Online Purchases */}
        <button
          onClick={onTapToUpload}
          className="w-full glass-card rounded-2xl p-4 border border-primary/30 hover:border-primary/60 transition-all duration-300 flex items-center justify-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-semibold text-primary">Tap to Upload</span>
        </button>

        {/* Security Footer */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Shield className="w-3.5 h-3.5" />
            <span className="text-xs">Secure</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Zap className="w-3.5 h-3.5" />
            <span className="text-xs">Fast</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs">Trusted</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-2">
          <p className="text-foreground font-semibold text-sm">PayGo Financial Services</p>
        </div>
      </div>
    </div>
  );
};

export default PayIdPlanSelect;