import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Lock, Mail, Eye, EyeOff, Shield, LogOut, Users, Image, Gift, BarChart3, FileText, Bell, Settings, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import PaymentUploadsAdmin from '@/components/admin/PaymentUploadsAdmin';
import UsersAdmin from '@/components/admin/UsersAdmin';
import ReferralsAdmin from '@/components/admin/ReferralsAdmin';
import StatsAdmin from '@/components/admin/StatsAdmin';
import AuditLogsAdmin from '@/components/admin/AuditLogsAdmin';
import NotificationsAdmin from '@/components/admin/NotificationsAdmin';
import SettingsAdmin from '@/components/admin/SettingsAdmin';

type AdminView = 'stats' | 'payments' | 'users' | 'referrals' | 'audit' | 'notifications' | 'settings';

const AdminPanel = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [currentView, setCurrentView] = useState<AdminView>('stats');
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    setCurrentView('stats');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Login Screen
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

  // Access Denied
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

  // Menu Items
  const menuItems = [
    { id: 'stats' as AdminView, icon: BarChart3, title: 'Dashboard', num: 1 },
    { id: 'payments' as AdminView, icon: Image, title: 'Payments', num: 2 },
    { id: 'users' as AdminView, icon: Users, title: 'Users', num: 3 },
    { id: 'referrals' as AdminView, icon: Gift, title: 'Referrals', num: 4 },
    { id: 'audit' as AdminView, icon: FileText, title: 'Audit Logs', num: 5 },
    { id: 'notifications' as AdminView, icon: Bell, title: 'Notifications', num: 6 },
    { id: 'settings' as AdminView, icon: Settings, title: 'Settings', num: 7 },
  ];

  // Render current view content
  const renderContent = () => {
    switch (currentView) {
      case 'stats': return <StatsAdmin onBack={() => {}} />;
      case 'payments': return <PaymentUploadsAdmin onBack={() => {}} onLogAudit={logAudit} />;
      case 'users': return <UsersAdmin onBack={() => {}} onLogAudit={logAudit} />;
      case 'referrals': return <ReferralsAdmin onBack={() => {}} />;
      case 'audit': return <AuditLogsAdmin onBack={() => {}} />;
      case 'notifications': return <NotificationsAdmin onBack={() => {}} />;
      case 'settings': return <SettingsAdmin onBack={() => {}} />;
      default: return <StatsAdmin onBack={() => {}} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div 
        className={`fixed lg:relative z-40 h-screen transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-0 lg:w-16'
        }`}
      >
        {/* Sidebar Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 lg:hidden z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Content */}
        <div 
          className={`fixed lg:relative h-full bg-card border-r border-border/50 transition-all duration-300 z-40 ${
            sidebarOpen ? 'w-64 translate-x-0' : 'w-16 -translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
            <div className={`flex items-center gap-3 ${!sidebarOpen && 'lg:hidden'}`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-foreground">Admin</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center lg:hidden"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Sidebar Menu */}
          <nav className="p-3 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  currentView === item.id
                    ? 'bg-primary text-white'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  currentView === item.id ? 'bg-white/20' : 'bg-muted'
                }`}>
                  <span className={`text-sm font-bold ${currentView === item.id ? 'text-white' : 'text-primary'}`}>
                    {item.num}
                  </span>
                </div>
                <item.icon className={`w-5 h-5 flex-shrink-0 ${sidebarOpen ? '' : 'lg:mx-auto'}`} />
                <span className={`font-medium ${!sidebarOpen && 'lg:hidden'}`}>{item.title}</span>
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border/50">
            <div className={`mb-3 px-3 py-2 ${!sidebarOpen && 'lg:hidden'}`}>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all"
            >
              <LogOut className={`w-5 h-5 flex-shrink-0 ${sidebarOpen ? '' : 'lg:mx-auto'}`} />
              <span className={`font-medium ${!sidebarOpen && 'lg:hidden'}`}>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-4 border-b border-border/50 bg-card/50 backdrop-blur sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-10 h-10 rounded-xl hover:bg-muted flex items-center justify-center"
            >
              {sidebarOpen ? (
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            <h1 className="text-lg font-semibold text-foreground">
              {menuItems.find(m => m.id === currentView)?.title || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:block">{user?.email}</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">{user?.email?.charAt(0).toUpperCase()}</span>
            </div>
          </div>
        </header>

        {/* Page Content - Embedded without back buttons */}
        <div className="admin-content-area">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;