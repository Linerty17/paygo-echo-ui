import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Ban, CheckCircle, Loader2, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface BannedUser {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  country: string;
  balance: number;
  level: number;
  created_at: string;
  account_status: string;
}

interface BannedUsersAdminProps {
  onBack: () => void;
  onLogAudit: (action: string, entityType: string, entityId: string, details: object) => void;
}

const BannedUsersAdmin: React.FC<BannedUsersAdminProps> = ({ onBack, onLogAudit }) => {
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchBannedUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('account_status', 'banned')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setBannedUsers(data || []);
    } catch (error) {
      console.error('Error fetching banned users:', error);
      toast({
        title: "Error",
        description: "Could not load banned users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBannedUsers();
  }, []);

  const filteredUsers = bannedUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone?.includes(searchQuery)
  );

  const handleUnbanUser = async (user: BannedUser) => {
    setProcessing(user.id);
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ account_status: 'active' })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Notify user
      await supabase.from('user_notifications').insert({
        user_id: user.user_id,
        type: 'unbanned',
        title: 'Account Restored',
        message: 'Your account has been restored. Welcome back!',
        metadata: {}
      });

      toast({
        title: "User Unbanned",
        description: `${user.name} has been unbanned`,
      });

      onLogAudit('unban_user', 'profiles', user.id, {
        user_name: user.name,
        user_email: user.email
      });

      fetchBannedUsers();
    } catch (error) {
      console.error('Error unbanning user:', error);
      toast({
        title: "Error",
        description: "Could not unban user",
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
          <h2 className="text-2xl font-bold text-foreground">Banned Users</h2>
          <p className="text-muted-foreground">Manage suspended accounts</p>
        </div>
        <Button onClick={fetchBannedUsers} variant="outline" className="rounded-xl">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="glass-card rounded-2xl p-4 border border-red-500/30 bg-red-500/5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
            <Ban className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">{bannedUsers.length}</p>
            <p className="text-sm text-muted-foreground">Total Banned Users</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or phone..."
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
            <UserX className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No banned users found</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} className="glass-card rounded-2xl p-4 border border-red-500/30">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{user.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 text-xs font-medium">
                      Banned
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    {user.phone && <span>{user.phone}</span>}
                    <span>•</span>
                    <span>Level {user.level}</span>
                    <span>•</span>
                    <span>₦{user.balance.toLocaleString()}</span>
                    <span>•</span>
                    <span>Joined {formatDate(user.created_at)}</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleUnbanUser(user)}
                  variant="outline"
                  size="sm"
                  disabled={processing === user.id}
                  className="rounded-xl border-green-500/50 text-green-500 hover:bg-green-500/10"
                >
                  {processing === user.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Unban
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BannedUsersAdmin;