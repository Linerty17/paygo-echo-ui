import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, RefreshCw, Shield, ShieldPlus, ShieldX, Crown, Users, Trash2 } from 'lucide-react';
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

interface UserWithRoles {
  id: string;
  user_id: string;
  name: string;
  email: string;
  roles: string[];
}

interface RolesAdminProps {
  onBack: () => void;
  currentUserEmail: string;
  onLogAudit: (action: string, entityType: string, entityId: string, details: object) => void;
}

const RolesAdmin: React.FC<RolesAdminProps> = ({ onBack, currentUserEmail, onLogAudit }) => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [processing, setProcessing] = useState(false);

  const fetchUsersWithRoles = async () => {
    setLoading(true);
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, user_id, name, email')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Map roles to users
      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        roles: roles?.filter(r => r.user_id === profile.user_id).map(r => r.role) || []
      })) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users with roles:', error);
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
    fetchUsersWithRoles();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const grantRole = async (user: UserWithRoles, role: string) => {
    setProcessing(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: user.user_id, role: role as 'admin' | 'moderator' | 'user' });

      if (error) throw error;

      toast({
        title: "Role Granted!",
        description: `${user.name} is now a ${role}`,
      });

      onLogAudit('grant_role', 'user_roles', user.user_id, { 
        user_name: user.name, 
        user_email: user.email,
        role 
      });

      fetchUsersWithRoles();
      setSelectedUser(null);
      setSelectedRole('');
    } catch (error: any) {
      console.error('Error granting role:', error);
      toast({
        title: "Error",
        description: error.message?.includes('duplicate') ? "User already has this role" : "Could not grant role",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const revokeRole = async (user: UserWithRoles, role: string) => {
    if (user.email === currentUserEmail && role === 'admin') {
      toast({
        title: "Cannot Remove",
        description: "You cannot remove your own admin role",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', user.user_id)
        .eq('role', role as 'admin' | 'moderator' | 'user');

      if (error) throw error;

      toast({
        title: "Role Revoked",
        description: `${role} role removed from ${user.name}`,
      });

      onLogAudit('revoke_role', 'user_roles', user.user_id, { 
        user_name: user.name, 
        user_email: user.email,
        role 
      });

      fetchUsersWithRoles();
    } catch (error) {
      console.error('Error revoking role:', error);
      toast({
        title: "Error",
        description: "Could not revoke role",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-500';
      case 'moderator': return 'bg-blue-500/20 text-blue-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="w-3 h-3" />;
      case 'moderator': return <Shield className="w-3 h-3" />;
      default: return <Users className="w-3 h-3" />;
    }
  };

  const adminsCount = users.filter(u => u.roles.includes('admin')).length;
  const moderatorsCount = users.filter(u => u.roles.includes('moderator')).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass-header text-foreground p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack}>
              <ArrowLeft className="w-6 h-6 text-primary" />
            </button>
            <h1 className="text-xl font-semibold">Role Management</h1>
          </div>
          <button
            onClick={fetchUsersWithRoles}
            className="glass w-10 h-10 rounded-xl flex items-center justify-center"
          >
            <RefreshCw className={`w-5 h-5 text-primary ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card rounded-xl p-4 text-center">
            <Crown className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{adminsCount}</p>
            <p className="text-xs text-muted-foreground">Admins</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <Shield className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{moderatorsCount}</p>
            <p className="text-xs text-muted-foreground">Moderators</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <Users className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{users.length}</p>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 glass-input rounded-xl"
          />
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
                  <p className="text-foreground font-semibold">{user.name}</p>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
                <button
                  onClick={() => setSelectedUser(user)}
                  className="glass w-9 h-9 rounded-xl flex items-center justify-center"
                >
                  <ShieldPlus className="w-4 h-4 text-primary" />
                </button>
              </div>

              {/* Current Roles */}
              <div className="flex flex-wrap gap-2">
                {user.roles.length === 0 ? (
                  <span className="px-3 py-1 bg-gray-500/10 text-gray-500 text-xs rounded-full">No special roles</span>
                ) : (
                  user.roles.map((role) => (
                    <div
                      key={role}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${getRoleBadgeColor(role)}`}
                    >
                      {getRoleIcon(role)}
                      <span className="text-xs font-medium capitalize">{role}</span>
                      <button
                        onClick={() => revokeRole(user, role)}
                        disabled={processing}
                        className="ml-1 hover:opacity-70"
                      >
                        <ShieldX className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Role Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => { setSelectedUser(null); setSelectedRole(''); }}
        >
          <div
            className="glass-card rounded-3xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Add Role</h3>
              <button
                onClick={() => { setSelectedUser(null); setSelectedRole(''); }}
                className="w-8 h-8 rounded-full glass flex items-center justify-center"
              >
                <ShieldX className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-foreground font-semibold">{selectedUser.name}</p>
              <p className="text-muted-foreground text-sm">{selectedUser.email}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Select Role</label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="h-12 glass-input rounded-xl">
                    <SelectValue placeholder="Choose a role..." />
                  </SelectTrigger>
                  <SelectContent>
                    {!selectedUser.roles.includes('admin') && (
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-red-500" />
                          Admin (Full access)
                        </div>
                      </SelectItem>
                    )}
                    {!selectedUser.roles.includes('moderator') && (
                      <SelectItem value="moderator">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-blue-500" />
                          Moderator (Limited access)
                        </div>
                      </SelectItem>
                    )}
                    {!selectedUser.roles.includes('user') && (
                      <SelectItem value="user">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          User (Basic role)
                        </div>
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={() => selectedRole && grantRole(selectedUser, selectedRole)}
              disabled={!selectedRole || processing}
              className="w-full h-12 mt-6 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl"
            >
              {processing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldPlus className="w-4 h-4 mr-2" />
                  Grant Role
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesAdmin;
