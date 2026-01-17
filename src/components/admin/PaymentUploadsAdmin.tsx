import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Clock, Eye, RefreshCw, Image, Bell, Download, Search, Filter, CheckSquare, Square, Ban, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  onLogAudit: (action: string, entityType: string, entityId: string, details: object) => void;
}

const PaymentUploadsAdmin: React.FC<PaymentUploadsAdminProps> = ({ onBack, onLogAudit }) => {
  const [uploads, setUploads] = useState<PaymentUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUpload, setSelectedUpload] = useState<PaymentUpload | null>(null);
  const [processing, setProcessing] = useState(false);
  const [newPaymentCount, setNewPaymentCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);

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
          
          setUploads(prev => [newPayment, ...prev]);
          setNewPaymentCount(prev => prev + 1);
          
          toast({
            title: "🔔 New Payment Submitted!",
            description: `${newPayment.user_name} submitted ₦${newPayment.amount.toLocaleString()}`,
          });

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
          const updatedPayment = payload.new as PaymentUpload;
          setUploads(prev => prev.map(u => u.id === updatedPayment.id ? updatedPayment : u));
        }
      )
      .subscribe();

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredUploads = uploads.filter(upload => {
    const matchesSearch = 
      upload.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      upload.user_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || upload.status === filterStatus;
    const matchesType = filterType === 'all' || upload.payment_type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const uniqueTypes = [...new Set(uploads.map(u => u.payment_type))];

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

      // Send real-time notification to user
      await supabase.from('user_notifications').insert({
        user_id: upload.user_id,
        type: 'payment_approved',
        title: 'Payment Approved! 🎉',
        message: 'Your payment has been verified and approved.',
        metadata: { payid_code: 'PAY-25353531', amount: upload.amount, payment_type: upload.payment_type }
      });

      toast({
        title: "Payment Approved!",
        description: `Payment from ${upload.user_name} has been approved`,
      });

      onLogAudit('approve_payment', 'payment_uploads', upload.id, {
        user_name: upload.user_name,
        user_email: upload.user_email,
        amount: upload.amount,
        payment_type: upload.payment_type
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

      // Send real-time notification to user
      await supabase.from('user_notifications').insert({
        user_id: upload.user_id,
        type: 'payment_declined',
        title: 'Payment Not Confirmed',
        message: 'Your payment could not be verified. Please ensure you upload a valid payment receipt.',
        metadata: { amount: upload.amount, payment_type: upload.payment_type }
      });

      toast({
        title: "Payment Declined",
        description: `Payment from ${upload.user_name} has been declined`,
      });

      onLogAudit('decline_payment', 'payment_uploads', upload.id, {
        user_name: upload.user_name,
        user_email: upload.user_email,
        amount: upload.amount,
        payment_type: upload.payment_type
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

  const handleBanFromPayment = async (upload: PaymentUpload) => {
    setProcessing(true);
    try {
      // Decline the payment
      await supabase
        .from('payment_uploads')
        .update({ 
          status: 'declined',
          processed_at: new Date().toISOString()
        })
        .eq('id', upload.id);

      // Ban the user
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ account_status: 'banned' })
        .eq('user_id', upload.user_id);

      if (profileError) throw profileError;

      // Notify user
      await supabase.from('user_notifications').insert({
        user_id: upload.user_id,
        type: 'banned',
        title: 'Account Suspended',
        message: 'Your account has been suspended due to payment issues. Contact support for more information.',
        metadata: { payment_id: upload.id }
      });

      toast({
        title: "User Banned",
        description: `${upload.user_name} has been banned and payment declined`,
      });

      onLogAudit('ban_user_from_payment', 'profiles', upload.user_id, {
        user_name: upload.user_name,
        user_email: upload.user_email,
        payment_id: upload.id,
        amount: upload.amount
      });

      fetchUploads();
      setSelectedUpload(null);
    } catch (error) {
      console.error('Error banning user:', error);
      toast({
        title: "Error",
        description: "Could not ban user",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedPayments.length === 0) return;
    setProcessing(true);
    
    try {
      const pendingSelected = filteredUploads
        .filter(u => selectedPayments.includes(u.id) && u.status === 'pending');
      
      for (const upload of pendingSelected) {
        await supabase
          .from('payment_uploads')
          .update({ 
            status: 'approved',
            processed_at: new Date().toISOString()
          })
          .eq('id', upload.id);

        onLogAudit('bulk_approve_payment', 'payment_uploads', upload.id, {
          user_name: upload.user_name,
          amount: upload.amount
        });
      }

      toast({
        title: "Bulk Approved!",
        description: `${pendingSelected.length} payments approved`,
      });

      setSelectedPayments([]);
      fetchUploads();
    } catch (error) {
      console.error('Error bulk approving:', error);
      toast({
        title: "Error",
        description: "Could not complete bulk approval",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const toggleSelectPayment = (id: string) => {
    setSelectedPayments(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const selectAllPending = () => {
    const pendingIds = filteredUploads.filter(u => u.status === 'pending').map(u => u.id);
    if (selectedPayments.length === pendingIds.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(pendingIds);
    }
  };

  const exportToCSV = () => {
    const headers = ['User', 'Email', 'Amount', 'Type', 'Status', 'Submitted', 'Processed'];
    const rows = filteredUploads.map(upload => [
      upload.user_name,
      upload.user_email,
      upload.amount,
      upload.payment_type,
      upload.status,
      new Date(upload.created_at).toLocaleString(),
      upload.processed_at ? new Date(upload.processed_at).toLocaleString() : ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `payments_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "Exported!",
      description: `${filteredUploads.length} payments exported`,
    });
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

  const pendingCount = uploads.filter(u => u.status === 'pending').length;
  const selectedPendingCount = filteredUploads.filter(u => selectedPayments.includes(u.id) && u.status === 'pending').length;

  const showHeader = onBack && typeof onBack === 'function' && onBack.toString() !== '() => {}';

  return (
    <div className="min-h-screen bg-background">
      {/* Header - only show if onBack is a real function */}
      {showHeader && (
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
                    onClick={() => setNewPaymentCount(0)}
                    className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse"
                  >
                    <Bell className="w-3 h-3" />
                    {newPaymentCount} new
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={exportToCSV} className="glass w-10 h-10 rounded-xl flex items-center justify-center">
                <Download className="w-5 h-5 text-primary" />
              </button>
              <button 
                onClick={() => { fetchUploads(); setNewPaymentCount(0); }}
                className="glass w-10 h-10 rounded-xl flex items-center justify-center"
              >
                <RefreshCw className={`w-5 h-5 text-primary ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card rounded-xl p-3 text-center bg-amber-500/10">
            <Clock className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-foreground">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <div className="glass-card rounded-xl p-3 text-center bg-green-500/10">
            <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-foreground">{uploads.filter(u => u.status === 'approved').length}</p>
            <p className="text-xs text-muted-foreground">Approved</p>
          </div>
          <div className="glass-card rounded-xl p-3 text-center bg-red-500/10">
            <XCircle className="w-5 h-5 text-red-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-foreground">{uploads.filter(u => u.status === 'declined').length}</p>
            <p className="text-xs text-muted-foreground">Declined</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 glass-input rounded-xl"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="h-10 glass-input rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="h-10 glass-input rounded-xl">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {uniqueTypes.map(type => (
                <SelectItem key={type} value={type}>{type.replace('_', ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {pendingCount > 0 && (
          <div className="flex items-center justify-between glass rounded-xl p-3">
            <button onClick={selectAllPending} className="flex items-center gap-2 text-sm text-muted-foreground">
              {selectedPayments.length > 0 ? (
                <CheckSquare className="w-4 h-4 text-primary" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              Select Pending ({pendingCount})
            </button>
            {selectedPendingCount > 0 && (
              <Button
                onClick={handleBulkApprove}
                disabled={processing}
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white rounded-lg"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve ({selectedPendingCount})
              </Button>
            )}
          </div>
        )}

        {/* Payments List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : filteredUploads.length === 0 ? (
          <div className="text-center py-12">
            <Image className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No payment uploads found</p>
          </div>
        ) : (
          filteredUploads.map((upload) => (
            <div 
              key={upload.id}
              className={`glass-card rounded-2xl p-4 border transition-colors ${
                selectedPayments.includes(upload.id) 
                  ? 'border-primary/50 bg-primary/5' 
                  : 'border-border/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  {upload.status === 'pending' && (
                    <button onClick={() => toggleSelectPayment(upload.id)}>
                      {selectedPayments.includes(upload.id) ? (
                        <CheckSquare className="w-5 h-5 text-primary" />
                      ) : (
                        <Square className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                  )}
                  <div>
                    <p className="text-foreground font-semibold">{upload.user_name}</p>
                    <p className="text-muted-foreground text-sm">{upload.user_email}</p>
                  </div>
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
                <div className="space-y-2">
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
                  <Button
                    onClick={() => handleBanFromPayment(upload)}
                    disabled={processing}
                    variant="outline"
                    className="w-full h-10 border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-xl text-sm"
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Decline & Ban User
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
              <div className="space-y-2 mt-4">
                <div className="flex gap-3">
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
                <Button
                  onClick={() => handleBanFromPayment(selectedUpload)}
                  disabled={processing}
                  variant="outline"
                  className="w-full h-10 border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-xl text-sm"
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Decline & Ban User
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
