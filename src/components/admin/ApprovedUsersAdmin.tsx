import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, CheckCircle, Shield, Ban, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ApprovedUser {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  payment_type: string;
  amount: number;
  payid_code: string | null;
  payid_status: string | null;
  status: string;
  created_at: string;
  processed_at: string | null;
}

interface ApprovedUsersAdminProps {
  onBack: () => void;
  onLogAudit: (action: string, entityType: string, entityId: string, details: object) => void;
}

const ApprovedUsersAdmin: React.FC<ApprovedUsersAdminProps> = ({ onBack, onLogAudit }) => {
  const [approvedUsers, setApprovedUsers] = useState<ApprovedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchApprovedUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payment_uploads')
        .select('*')
        .eq('status', 'approved')
        .order('processed_at', { ascending: false });

      if (error) throw error;
      setApprovedUsers(data || []);
    } catch (error) {
      console.error('Error fetching approved users:', error);
      toast({
        title: "Error",
        description: "Could not load approved users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedUsers();
  }, []);

  const filteredUsers = approvedUsers.filter(user =>
    user.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.payid_code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRevokePayId = async (user: ApprovedUser) => {
    setProcessing(user.id);
    try {
      // Update payment upload to revoke PAY ID
      const { error: updateError } = await supabase
        .from('payment_uploads')
        .update({ 
          payid_status: 'revoked',
          payid_code: null
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Notify user
      await supabase.from('user_notifications').insert({
        user_id: user.user_id,
        type: 'payid_revoked',
        title: 'PAY ID Revoked',
        message: 'Your PAY ID has been revoked by admin. Contact support for more information.',
        metadata: { payment_id: user.id }
      });

      toast({
        title: "PAY ID Revoked",
        description: `${user.user_name}'s PAY ID has been revoked`,
      });

      onLogAudit('revoke_payid', 'payment_uploads', user.id, {
        user_name: user.user_name,
        user_email: user.user_email,
        payid_code: user.payid_code
      });

      fetchApprovedUsers();
    } catch (error) {
      console.error('Error revoking PAY ID:', error);
      toast({
        title: "Error",
        description: "Could not revoke PAY ID",
        variant: "destructive"
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleBanUser = async (user: ApprovedUser) => {
    setProcessing(user.id);
    try {
      // Update user profile to banned
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ account_status: 'banned' })
        .eq('user_id', user.user_id);

      if (profileError) throw profileError;

      // Also revoke PAY ID
      await supabase
        .from('payment_uploads')
        .update({ 
          payid_status: 'revoked',
          payid_code: null
        })
        .eq('id', user.id);

      // Notify user
      await supabase.from('user_notifications').insert({
        user_id: user.user_id,
        type: 'banned',
        title: 'Account Suspended',
        message: 'Your account has been suspended. Contact support for more information.',
        metadata: { payment_id: user.id }
      });

      toast({
        title: "User Banned",
        description: `${user.user_name} has been banned`,
      });

      onLogAudit('ban_user', 'profiles', user.user_id, {
        user_name: user.user_name,
        user_email: user.user_email,
        from_approved_users: true
      });

      fetchApprovedUsers();
    } catch (error) {
      console.error('Error banning user:', error);
      toast({
        title: "Error",
        description: "Could not ban user",
        variant: "destructive"
      });
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Approved Users</h2>
          <p className="text-muted-foreground">Manage users with approved payments</p>
        </div>
        <Button onClick={fetchApprovedUsers} variant="outline" className="rounded-xl">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-green-500/30 bg-green-500/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{approvedUsers.length}</p>
              <p className="text-xs text-muted-foreground">Total Approved</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-primary/30 bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {approvedUsers.filter(u => u.payid_status !== 'revoked').length}
              </p>
              <p className="text-xs text-muted-foreground">Active PAY IDs</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {approvedUsers.filter(u => u.payid_status === 'revoked').length}
              </p>
              <p className="text-xs text-muted-foreground">Revoked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or PAY ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 bg-muted/50 border-border/50 rounded-xl"
        />
      </div>

      {/* User List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No approved users found</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} className="glass-card rounded-2xl p-4 border border-border/50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{user.user_name}</h3>
                    {user.payid_status === 'revoked' ? (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 text-xs font-medium">
                        Revoked
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-500 text-xs font-medium">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{user.user_email}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>₦{user.amount.toLocaleString()}</span>
                    <span>•</span>
                    <span>{user.payment_type}</span>
                    <span>•</span>
                    <span>Approved {user.processed_at ? formatDate(user.processed_at) : 'N/A'}</span>
                  </div>
                  {user.payid_code && (
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10">
                      <Shield className="w-3 h-3 text-primary" />
                      <span className="text-sm font-mono font-medium text-primary">{user.payid_code}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {user.payid_status !== 'revoked' && (
                    <Button
                      onClick={() => handleRevokePayId(user)}
                      variant="outline"
                      size="sm"
                      disabled={processing === user.id}
                      className="rounded-xl border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
                    >
                      {processing === user.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 mr-1" />
                          Revoke
                        </>
                      )}
                    </Button>
                  )}
                  <Button
                    onClick={() => handleBanUser(user)}
                    variant="outline"
                    size="sm"
                    disabled={processing === user.id}
                    className="rounded-xl border-red-500/50 text-red-500 hover:bg-red-500/10"
                  >
                    {processing === user.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Ban className="w-4 h-4 mr-1" />
                        Ban
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApprovedUsersAdmin;