import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Clock, Eye, RefreshCw, Image, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface PaymentUpload {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  payment_type: string;
  amount: number;
  screenshot_url: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  processed_at: string | null;
}

interface PaymentUploadsAdminProps {
  onBack: () => void;
}

const PaymentUploadsAdmin: React.FC<PaymentUploadsAdminProps> = ({ onBack }) => {
  const [uploads, setUploads] = useState<PaymentUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUpload, setSelectedUpload] = useState<PaymentUpload | null>(null);
  const [processing, setProcessing] = useState(false);
  const [newPaymentCount, setNewPaymentCount] = useState(0);

  const fetchUploads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payment_uploads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUploads(data || []);
    } catch (error) {
      console.error('Error fetching uploads:', error);
      toast({
        title: "Error",
        description: "Could not load payment uploads",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('payment-uploads-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'payment_uploads'
        },
        (payload) => {
          console.log('New payment received:', payload);
          const newPayment = payload.new as PaymentUpload;
          
          // Add to uploads list
          setUploads(prev => [newPayment, ...prev]);
          setNewPaymentCount(prev => prev + 1);
          
          // Show toast notification
          toast({
            title: "🔔 New Payment Submitted!",
            description: `${newPayment.user_name} submitted ₦${newPayment.amount.toLocaleString()}`,
          });

          // Play notification sound (optional browser notification)
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('New Payment Submitted', {
              body: `${newPayment.user_name} - ₦${newPayment.amount.toLocaleString()}`,
              icon: '/favicon.png'
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'payment_uploads'
        },
        (payload) => {
          console.log('Payment updated:', payload);
          const updatedPayment = payload.new as PaymentUpload;
          setUploads(prev => prev.map(u => u.id === updatedPayment.id ? updatedPayment : u));
        }
      )
      .subscribe();

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleApprove = async (upload: PaymentUpload) => {
    setProcessing(true);
    try {
      const { error } = await supabase
        .from('payment_uploads')
        .update({ 
          status: 'approved',
          processed_at: new Date().toISOString()
        })
        .eq('id', upload.id);

      if (error) throw error;

      toast({
        title: "Payment Approved!",
        description: `Payment from ${upload.user_name} has been approved`,
      });

      fetchUploads();
      setSelectedUpload(null);
    } catch (error) {
      console.error('Error approving:', error);
      toast({
        title: "Error",
        description: "Could not approve payment",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleDecline = async (upload: PaymentUpload) => {
    setProcessing(true);
    try {
      const { error } = await supabase
        .from('payment_uploads')
        .update({ 
          status: 'declined',
          processed_at: new Date().toISOString()
        })
        .eq('id', upload.id);

      if (error) throw error;

      toast({
        title: "Payment Declined",
        description: `Payment from ${upload.user_name} has been declined`,
      });

      fetchUploads();
      setSelectedUpload(null);
    } catch (error) {
      console.error('Error declining:', error);
      toast({
        title: "Error",
        description: "Could not decline payment",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-500 bg-green-500/10';
      case 'declined': return 'text-red-500 bg-red-500/10';
      default: return 'text-amber-500 bg-amber-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'declined': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const clearNewPaymentBadge = () => {
    setNewPaymentCount(0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass-header text-foreground p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack}>
              <ArrowLeft className="w-6 h-6 text-primary" />
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">Payment Uploads</h1>
              {newPaymentCount > 0 && (
                <button 
                  onClick={clearNewPaymentBadge}
                  className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse"
                >
                  <Bell className="w-3 h-3" />
                  {newPaymentCount} new
                </button>
              )}
            </div>
          </div>
          <button 
            onClick={() => { fetchUploads(); clearNewPaymentBadge(); }}
            className="glass w-10 h-10 rounded-xl flex items-center justify-center"
          >
            <RefreshCw className={`w-5 h-5 text-primary ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : uploads.length === 0 ? (
          <div className="text-center py-12">
            <Image className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No payment uploads yet</p>
          </div>
        ) : (
          uploads.map((upload) => (
            <div 
              key={upload.id}
              className="glass-card rounded-2xl p-4 border border-border/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-foreground font-semibold">{upload.user_name}</p>
                  <p className="text-muted-foreground text-sm">{upload.user_email}</p>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${getStatusColor(upload.status)}`}>
                  {getStatusIcon(upload.status)}
                  <span className="text-xs font-medium capitalize">{upload.status}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-lg font-bold text-primary">₦{upload.amount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="text-sm text-foreground capitalize">{upload.payment_type.replace('_', ' ')}</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-3">
                Submitted: {new Date(upload.created_at).toLocaleString()}
              </p>

              {upload.screenshot_url && (
                <button
                  onClick={() => setSelectedUpload(upload)}
                  className="w-full glass rounded-xl p-3 flex items-center justify-center gap-2 mb-3 hover:bg-primary/10 transition-colors"
                >
                  <Eye className="w-4 h-4 text-primary" />
                  <span className="text-primary text-sm font-medium">View Screenshot</span>
                </button>
              )}

              {upload.status === 'pending' && (
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleApprove(upload)}
                    disabled={processing}
                    className="flex-1 h-12 bg-green-500 hover:bg-green-600 text-white rounded-xl"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleDecline(upload)}
                    disabled={processing}
                    variant="outline"
                    className="flex-1 h-12 border-red-500/50 text-red-500 hover:bg-red-500/10 rounded-xl"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Decline
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Screenshot Modal */}
      {selectedUpload && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedUpload(null)}
        >
          <div 
            className="glass-card rounded-3xl p-4 max-w-lg w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Payment Screenshot</h3>
              <button 
                onClick={() => setSelectedUpload(null)}
                className="w-8 h-8 rounded-full glass flex items-center justify-center"
              >
                <XCircle className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-muted-foreground">From: <span className="text-foreground">{selectedUpload.user_name}</span></p>
              <p className="text-sm text-muted-foreground">Amount: <span className="text-primary font-bold">₦{selectedUpload.amount.toLocaleString()}</span></p>
            </div>

            {selectedUpload.screenshot_url && (
              <img 
                src={selectedUpload.screenshot_url} 
                alt="Payment screenshot" 
                className="w-full rounded-xl"
              />
            )}

            {selectedUpload.status === 'pending' && (
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={() => handleApprove(selectedUpload)}
                  disabled={processing}
                  className="flex-1 h-12 bg-green-500 hover:bg-green-600 text-white rounded-xl"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleDecline(selectedUpload)}
                  disabled={processing}
                  variant="outline"
                  className="flex-1 h-12 border-red-500/50 text-red-500 hover:bg-red-500/10 rounded-xl"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Decline
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentUploadsAdmin;
