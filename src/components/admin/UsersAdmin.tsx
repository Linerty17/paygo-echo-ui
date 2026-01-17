import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, RefreshCw, Users, Edit, Save, X, Wallet, Shield, ShieldOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  country: string;
  balance: number;
  level: number;
  referral_code: string | null;
  referred_by: string | null;
  is_admin: boolean | null;
  created_at: string;
}

interface UsersAdminProps {
  onBack: () => void;
}

const UsersAdmin: React.FC<UsersAdminProps> = ({ onBack }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editBalance, setEditBalance] = useState('');
  const [editLevel, setEditLevel] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Could not load users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone?.includes(searchQuery)
  );

  const handleEdit = (user: UserProfile) => {
    setEditingUser(user);
    setEditBalance(user.balance.toString());
    setEditLevel(user.level.toString());
  };

  const handleSave = async () => {
    if (!editingUser) return;
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          balance: parseFloat(editBalance) || 0,
          level: parseInt(editLevel) || 1
        })
        .eq('id', editingUser.id);

      if (error) throw error;

      toast({
        title: "User Updated!",
        description: `${editingUser.name}'s profile has been updated`,
      });

      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Could not update user",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleAdmin = async (user: UserProfile) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !user.is_admin })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: user.is_admin ? "Admin Removed" : "Admin Granted",
        description: `${user.name} is ${user.is_admin ? 'no longer' : 'now'} an admin`,
      });

      fetchUsers();
    } catch (error) {
      console.error('Error toggling admin:', error);
      toast({
        title: "Error",
        description: "Could not update admin status",
        variant: "destructive"
      });
    }
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
            <h1 className="text-xl font-semibold">User Management</h1>
          </div>
          <button 
            onClick={fetchUsers}
            className="glass w-10 h-10 rounded-xl flex items-center justify-center"
          >
            <RefreshCw className={`w-5 h-5 text-primary ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 glass-input rounded-xl"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card rounded-xl p-4 text-center">
            <Users className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{users.length}</p>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <Wallet className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              ₦{users.reduce((sum, u) => sum + u.balance, 0).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Total Balance</p>
          </div>
        </div>

        {/* Users List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No users found</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div 
              key={user.id}
              className="glass-card rounded-2xl p-4 border border-border/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-foreground font-semibold">{user.name}</p>
                    {user.is_admin && (
                      <span className="px-2 py-0.5 bg-red-500/20 text-red-500 text-xs rounded-full">Admin</span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                  {user.phone && <p className="text-muted-foreground text-xs">{user.phone}</p>}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleAdmin(user)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      user.is_admin ? 'bg-red-500/20 text-red-500' : 'glass text-muted-foreground'
                    }`}
                  >
                    {user.is_admin ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={() => handleEdit(user)}
                    className="glass w-9 h-9 rounded-xl flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4 text-primary" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="glass rounded-lg p-2">
                  <p className="text-xs text-muted-foreground">Balance</p>
                  <p className="text-sm font-bold text-green-500">₦{user.balance.toLocaleString()}</p>
                </div>
                <div className="glass rounded-lg p-2">
                  <p className="text-xs text-muted-foreground">Level</p>
                  <p className="text-sm font-bold text-primary">{user.level}</p>
                </div>
                <div className="glass rounded-lg p-2">
                  <p className="text-xs text-muted-foreground">Country</p>
                  <p className="text-sm font-bold text-foreground">{user.country || 'N/A'}</p>
                </div>
              </div>

              {user.referral_code && (
                <p className="text-xs text-muted-foreground mt-2">
                  Referral Code: <span className="text-primary font-mono">{user.referral_code}</span>
                </p>
              )}
              
              <p className="text-xs text-muted-foreground mt-1">
                Joined: {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setEditingUser(null)}
        >
          <div 
            className="glass-card rounded-3xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Edit User</h3>
              <button 
                onClick={() => setEditingUser(null)}
                className="w-8 h-8 rounded-full glass flex items-center justify-center"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-foreground font-semibold">{editingUser.name}</p>
              <p className="text-muted-foreground text-sm">{editingUser.email}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Balance (₦)</label>
                <Input
                  type="number"
                  value={editBalance}
                  onChange={(e) => setEditBalance(e.target.value)}
                  className="h-12 glass-input rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Level</label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={editLevel}
                  onChange={(e) => setEditLevel(e.target.value)}
                  className="h-12 glass-input rounded-xl"
                />
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full h-12 mt-6 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersAdmin;
