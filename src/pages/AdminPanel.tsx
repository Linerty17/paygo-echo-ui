import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Lock, Mail, Eye, EyeOff, Shield, ArrowLeft, LogOut, Users, Image, Gift, BarChart3 } from 'lucide-react';
import PaymentUploadsAdmin from '@/components/admin/PaymentUploadsAdmin';
import UsersAdmin from '@/components/admin/UsersAdmin';
import ReferralsAdmin from '@/components/admin/ReferralsAdmin';
import StatsAdmin from '@/components/admin/StatsAdmin';

type AdminView = 'dashboard' | 'payments' | 'users' | 'referrals' | 'stats';

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
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } else {
      setIsAdmin(data?.is_admin || false);
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive"
      });
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

  // Show specific admin views
  if (currentView === 'payments' && isAdmin) {
    return <PaymentUploadsAdmin onBack={() => setCurrentView('dashboard')} />;
  }
  if (currentView === 'users' && isAdmin) {
    return <UsersAdmin onBack={() => setCurrentView('dashboard')} />;
  }
  if (currentView === 'referrals' && isAdmin) {
    return <ReferralsAdmin onBack={() => setCurrentView('dashboard')} />;
  }
  if (currentView === 'stats' && isAdmin) {
    return <StatsAdmin onBack={() => setCurrentView('dashboard')} />;
  }

  // Not logged in - show login form
  if (!session) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-32 w-48 h-48 bg-primary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative w-full max-w-md">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-500/50 via-primary/50 to-red-500/50 rounded-[28px] blur-xl opacity-40" />
          
          <div className="relative glass-card rounded-3xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Admin Access</h1>
              <p className="text-muted-foreground text-sm mt-1">Authorized personnel only</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 glass-input rounded-xl"
                    placeholder="admin@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 h-14 glass-input rounded-xl"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Eye className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loggingIn}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-lg font-semibold"
              >
                {loggingIn ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Access Admin Panel
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Logged in but not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="glass-card rounded-3xl p-8 text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            You don't have admin privileges. Please contact an administrator.
          </p>
          <Button onClick={handleLogout} variant="outline" className="rounded-xl">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    );
  }

  // Admin dashboard with menu options
  const menuItems = [
    { 
      id: 'stats' as AdminView, 
      icon: BarChart3, 
      title: 'Dashboard Stats', 
      description: 'View platform analytics and metrics',
      gradient: 'from-blue-500 to-cyan-600',
      shadowColor: 'shadow-blue-500/30'
    },
    { 
      id: 'payments' as AdminView, 
      icon: Image, 
      title: 'Payment Uploads', 
      description: 'Review and approve payment screenshots',
      gradient: 'from-amber-500 to-orange-600',
      shadowColor: 'shadow-amber-500/30'
    },
    { 
      id: 'users' as AdminView, 
      icon: Users, 
      title: 'User Management', 
      description: 'Manage users, balances, and levels',
      gradient: 'from-green-500 to-emerald-600',
      shadowColor: 'shadow-green-500/30'
    },
    { 
      id: 'referrals' as AdminView, 
      icon: Gift, 
      title: 'Referrals', 
      description: 'View all referral activities and bonuses',
      gradient: 'from-purple-500 to-violet-600',
      shadowColor: 'shadow-purple-500/30'
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Header */}
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
          <Button onClick={handleLogout} variant="ghost" size="icon" className="rounded-xl">
            <LogOut className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className="w-full glass-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg ${item.shadowColor}`}>
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
              <ArrowLeft className="w-5 h-5 text-muted-foreground rotate-180" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
