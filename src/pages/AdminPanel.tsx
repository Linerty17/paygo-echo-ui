import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Lock, Mail, Eye, EyeOff, Shield, ArrowLeft, LogOut, Users, Image, Gift, BarChart3, Crown, FileText, Bell, Settings } from 'lucide-react';
import PaymentUploadsAdmin from '@/components/admin/PaymentUploadsAdmin';
import UsersAdmin from '@/components/admin/UsersAdmin';
import ReferralsAdmin from '@/components/admin/ReferralsAdmin';
import StatsAdmin from '@/components/admin/StatsAdmin';
import RolesAdmin from '@/components/admin/RolesAdmin';
import AuditLogsAdmin from '@/components/admin/AuditLogsAdmin';
import NotificationsAdmin from '@/components/admin/NotificationsAdmin';
import SettingsAdmin from '@/components/admin/SettingsAdmin';

type AdminView = 'dashboard' | 'payments' | 'users' | 'referrals' | 'stats' | 'roles' | 'audit' | 'notifications' | 'settings';

const AdminPanel = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            checkAdminStatus(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      setIsAdmin(!!data);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
    setLoading(false);
  };

  const logAudit = async (action: string, entityType: string, entityId: string, details: object) => {
    try {
      // Use type assertion since audit_logs table was just created and types haven't synced
      await (supabase.from('audit_logs') as any).insert({
        admin_user_id: user?.id || '',
        admin_email: user?.email || '',
        action,
        entity_type: entityType,
        entity_id: entityId,
        details
      });
    } catch (error) {
      console.error('Error logging audit:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Login Failed", description: "Invalid email or password", variant: "destructive" });
    }
    setLoggingIn(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setCurrentView('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Render views
  if (isAdmin) {
    switch (currentView) {
      case 'payments': return <PaymentUploadsAdmin onBack={() => setCurrentView('dashboard')} onLogAudit={logAudit} />;
      case 'users': return <UsersAdmin onBack={() => setCurrentView('dashboard')} onLogAudit={logAudit} />;
      case 'referrals': return <ReferralsAdmin onBack={() => setCurrentView('dashboard')} />;
      case 'stats': return <StatsAdmin onBack={() => setCurrentView('dashboard')} />;
      case 'roles': return <RolesAdmin onBack={() => setCurrentView('dashboard')} currentUserEmail={user?.email || ''} onLogAudit={logAudit} />;
      case 'audit': return <AuditLogsAdmin onBack={() => setCurrentView('dashboard')} />;
      case 'notifications': return <NotificationsAdmin onBack={() => setCurrentView('dashboard')} />;
      case 'settings': return <SettingsAdmin onBack={() => setCurrentView('dashboard')} />;
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="relative w-full max-w-md">
          <div className="glass-card rounded-3xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Admin Access</h1>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-12 h-14 glass-input rounded-xl" placeholder="admin@email.com" required />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="pl-12 pr-12 h-14 glass-input rounded-xl" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff className="w-5 h-5 text-muted-foreground" /> : <Eye className="w-5 h-5 text-muted-foreground" />}
                </button>
              </div>
              <Button type="submit" disabled={loggingIn} className="w-full h-14 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white text-lg font-semibold">
                {loggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Lock className="w-5 h-5 mr-2" />Access Admin Panel</>}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="glass-card rounded-3xl p-8 text-center max-w-md">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-6">You don't have admin privileges.</p>
          <Button onClick={handleLogout} variant="outline" className="rounded-xl"><LogOut className="w-4 h-4 mr-2" />Logout</Button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'stats' as AdminView, icon: BarChart3, title: 'Dashboard Stats', description: 'Platform analytics', gradient: 'from-blue-500 to-cyan-600' },
    { id: 'payments' as AdminView, icon: Image, title: 'Payment Uploads', description: 'Review payments', gradient: 'from-amber-500 to-orange-600' },
    { id: 'users' as AdminView, icon: Users, title: 'User Management', description: 'Manage users & balances', gradient: 'from-green-500 to-emerald-600' },
    { id: 'roles' as AdminView, icon: Crown, title: 'Role Management', description: 'Grant/revoke roles', gradient: 'from-red-500 to-rose-600' },
    { id: 'referrals' as AdminView, icon: Gift, title: 'Referrals', description: 'Referral activities', gradient: 'from-purple-500 to-violet-600' },
    { id: 'audit' as AdminView, icon: FileText, title: 'Audit Logs', description: 'Admin action history', gradient: 'from-slate-500 to-gray-600' },
    { id: 'notifications' as AdminView, icon: Bell, title: 'Notifications', description: 'Notification center', gradient: 'from-pink-500 to-rose-600' },
    { id: 'settings' as AdminView, icon: Settings, title: 'Settings', description: 'Admin preferences', gradient: 'from-indigo-500 to-blue-600' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="glass-header text-foreground p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="ghost" size="icon" className="rounded-xl"><LogOut className="w-5 h-5" /></Button>
        </div>
      </div>
      <div className="p-4 grid grid-cols-2 gap-3">
        {menuItems.map((item) => (
          <button key={item.id} onClick={() => setCurrentView(item.id)} className="glass-card rounded-2xl p-4 border border-border/50 hover:border-primary/30 transition-all text-left">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-3`}>
              <item.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
            <p className="text-muted-foreground text-xs">{item.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
