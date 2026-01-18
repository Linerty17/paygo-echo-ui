import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Lock, Mail, Eye, EyeOff, Shield, LogOut, Users, Image, Gift, BarChart3, FileText, Bell, Settings, X, Search, Clock, CheckCircle, Ban, CreditCard } from 'lucide-react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import PaymentUploadsAdmin from '@/components/admin/PaymentUploadsAdmin';
import UsersAdmin from '@/components/admin/UsersAdmin';
import ReferralsAdmin from '@/components/admin/ReferralsAdmin';
import StatsAdmin from '@/components/admin/StatsAdmin';
import AuditLogsAdmin from '@/components/admin/AuditLogsAdmin';
import NotificationsAdmin from '@/components/admin/NotificationsAdmin';
import SettingsAdmin from '@/components/admin/SettingsAdmin';
import ApprovedUsersAdmin from '@/components/admin/ApprovedUsersAdmin';
import BannedUsersAdmin from '@/components/admin/BannedUsersAdmin';

type AdminView = 'stats' | 'payments' | 'users' | 'approved' | 'banned' | 'referrals' | 'audit' | 'notifications' | 'settings';

interface SearchResult {
  type: 'user' | 'payment' | 'referral';
  id: string;
  title: string;
  subtitle: string;
}

const menuItems = [
  { id: 'stats' as AdminView, icon: BarChart3, title: 'Dashboard', num: 1 },
  { id: 'payments' as AdminView, icon: Image, title: 'Payments', num: 2 },
  { id: 'users' as AdminView, icon: Users, title: 'Users', num: 3 },
  { id: 'approved' as AdminView, icon: CheckCircle, title: 'Approved', num: 4 },
  { id: 'banned' as AdminView, icon: Ban, title: 'Banned', num: 5 },
  { id: 'referrals' as AdminView, icon: Gift, title: 'Referrals', num: 6 },
  { id: 'audit' as AdminView, icon: FileText, title: 'Audit Logs', num: 7 },
  { id: 'notifications' as AdminView, icon: Bell, title: 'Notifications', num: 8 },
  { id: 'settings' as AdminView, icon: Settings, title: 'Settings', num: 9 },
];

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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  const RECENT_SEARCHES_KEY = 'admin_recent_searches';
  const MAX_RECENT_SEARCHES = 5;

  // Fetch pending payments count
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const { count, error } = await supabase
          .from('payment_uploads')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        if (!error && count !== null) {
          setPendingCount(count);
        }
      } catch (error) {
        console.error('Error fetching pending count:', error);
      }
    };

    fetchPendingCount();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('admin-pending-count')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_uploads'
        },
        () => {
          fetchPendingCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  // Save recent search
  const saveRecentSearch = (result: SearchResult) => {
    const updated = [result, ...recentSearches.filter(r => r.id !== result.id)].slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  // Clear all recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  // Remove single recent search
  const removeRecentSearch = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter(r => r.id !== id);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
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

  // Global search function
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearchLoading(true);
    setShowSearchResults(true);

    try {
      const results: SearchResult[] = [];
      const searchTerm = `%${query}%`;

      // Search users
      const { data: users } = await supabase
        .from('profiles')
        .select('id, name, email, phone')
        .or(`name.ilike.${searchTerm},email.ilike.${searchTerm},phone.ilike.${searchTerm}`)
        .limit(5);

      if (users) {
        users.forEach(u => {
          results.push({
            type: 'user',
            id: u.id,
            title: u.name,
            subtitle: u.email
          });
        });
      }

      // Search payments
      const { data: payments } = await supabase
        .from('payment_uploads')
        .select('id, user_name, user_email, amount, status')
        .or(`user_name.ilike.${searchTerm},user_email.ilike.${searchTerm}`)
        .limit(5);

      if (payments) {
        payments.forEach(p => {
          results.push({
            type: 'payment',
            id: p.id,
            title: `${p.user_name} - ₦${p.amount.toLocaleString()}`,
            subtitle: `${p.status} • ${p.user_email}`
          });
        });
      }

      // Search referrals by joining with profiles
      const { data: referrals } = await supabase
        .from('referrals')
        .select(`
          id,
          bonus_amount,
          status,
          referrer:profiles!referrals_referrer_id_fkey(name, email),
          referred:profiles!referrals_referred_id_fkey(name, email)
        `)
        .limit(10);

      if (referrals) {
        referrals.forEach((r: any) => {
          const referrerMatch = r.referrer?.name?.toLowerCase().includes(query.toLowerCase()) ||
                               r.referrer?.email?.toLowerCase().includes(query.toLowerCase());
          const referredMatch = r.referred?.name?.toLowerCase().includes(query.toLowerCase()) ||
                               r.referred?.email?.toLowerCase().includes(query.toLowerCase());
          
          if (referrerMatch || referredMatch) {
            results.push({
              type: 'referral',
              id: r.id,
              title: `${r.referrer?.name || 'Unknown'} → ${r.referred?.name || 'Unknown'}`,
              subtitle: `₦${r.bonus_amount.toLocaleString()} • ${r.status}`
            });
          }
        });
      }

      setSearchResults(results.slice(0, 10));
    } catch (error) {
      console.error('Search error:', error);
    }

    setSearchLoading(false);
  };

  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(result);
    setShowSearchResults(false);
    setSearchQuery('');
    setSearchFocused(false);
    
    switch (result.type) {
      case 'user':
        setCurrentView('users');
        break;
      case 'payment':
        setCurrentView('payments');
        break;
      case 'referral':
        setCurrentView('referrals');
        break;
    }
  };

  const handleRecentClick = (result: SearchResult) => {
    saveRecentSearch(result);
    setShowSearchResults(false);
    setSearchQuery('');
    setSearchFocused(false);
    
    switch (result.type) {
      case 'user':
        setCurrentView('users');
        break;
      case 'payment':
        setCurrentView('payments');
        break;
      case 'referral':
        setCurrentView('referrals');
        break;
    }
  };

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show dropdown on focus (for recent searches)
  const handleSearchFocus = () => {
    setSearchFocused(true);
    if (searchQuery.length >= 2) {
      setShowSearchResults(true);
    }
  };

  if (loading) {
    return (
      <div className="h-screen h-[100dvh] bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Login Screen
  if (!session) {
    return (
      <div className="h-screen h-[100dvh] bg-background relative overflow-hidden flex items-center justify-center p-3">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="relative w-full max-w-sm">
          <div className="glass-card rounded-2xl p-5">
            <div className="text-center mb-5">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-lg font-bold text-foreground">Admin Access</h1>
            </div>
            <form onSubmit={handleLogin} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11 glass-input rounded-lg text-sm" placeholder="admin@email.com" required />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 h-11 glass-input rounded-lg text-sm" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
              <Button type="submit" disabled={loggingIn} className="w-full h-11 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-semibold">
                {loggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Lock className="w-4 h-4 mr-2" />Access Admin</>}
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
      <div className="h-screen h-[100dvh] bg-background flex items-center justify-center p-3">
        <div className="glass-card rounded-2xl p-5 text-center max-w-sm">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-base font-bold text-foreground mb-1.5">Access Denied</h2>
          <p className="text-sm text-muted-foreground mb-4">You don't have admin privileges.</p>
          <Button onClick={handleLogout} variant="outline" className="rounded-lg h-9 text-sm"><LogOut className="w-3.5 h-3.5 mr-1.5" />Logout</Button>
        </div>
      </div>
    );
  }

  // Render current view content
  const renderContent = () => {
    switch (currentView) {
      case 'stats': return <StatsAdmin onBack={() => {}} />;
      case 'payments': return <PaymentUploadsAdmin onBack={() => {}} onLogAudit={logAudit} />;
      case 'users': return <UsersAdmin onBack={() => {}} onLogAudit={logAudit} />;
      case 'approved': return <ApprovedUsersAdmin onBack={() => {}} onLogAudit={logAudit} />;
      case 'banned': return <BannedUsersAdmin onBack={() => {}} onLogAudit={logAudit} />;
      case 'referrals': return <ReferralsAdmin onBack={() => {}} />;
      case 'audit': return <AuditLogsAdmin onBack={() => {}} />;
      case 'notifications': return <NotificationsAdmin onBack={() => {}} />;
      case 'settings': return <SettingsAdmin onBack={() => {}} />;
      default: return <StatsAdmin onBack={() => {}} />;
    }
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="h-screen h-[100dvh] flex w-full overflow-hidden">
        <AdminSidebar 
          currentView={currentView}
          onViewChange={setCurrentView}
          onLogout={handleLogout}
          userEmail={user?.email}
        />
        
        <SidebarInset className="flex-1 flex flex-col h-full min-h-0 overflow-hidden">
          {/* Top Header */}
          <header className="border-b border-border/50 bg-card/50 backdrop-blur sticky top-0 z-30 flex-shrink-0">
            <div className="pt-[max(env(safe-area-inset-top),24px)]">
              <div className="h-12 flex items-center justify-between px-2">
                <div className="flex items-center gap-1.5">
                  <SidebarTrigger className="w-10 h-10 rounded-lg hover:bg-muted" />
                  <h1 className="text-xs font-semibold text-foreground truncate max-w-[80px] sm:max-w-none sm:text-sm">
                    {menuItems.find(m => m.id === currentView)?.title || 'Dashboard'}
                  </h1>
                </div>

                {/* Global Search */}
                <div ref={searchRef} className="relative flex-1 max-w-[140px] sm:max-w-md mx-1.5 sm:mx-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      onFocus={handleSearchFocus}
                      className="pl-7 sm:pl-10 h-7 sm:h-9 bg-muted/50 border-border/50 rounded-lg text-xs"
                    />
                    {searchLoading && (
                      <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 animate-spin text-muted-foreground" />
                    )}
                  </div>

                  {/* Search Results Dropdown */}
                  {(showSearchResults || (searchFocused && recentSearches.length > 0 && searchQuery.length < 2)) && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
                      {/* Recent Searches - show when no query */}
                      {searchQuery.length < 2 && recentSearches.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/50">
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                              <Clock className="w-2.5 h-2.5" />
                              <span>Recent</span>
                            </div>
                            <button
                              onClick={clearRecentSearches}
                              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                            >
                              Clear
                            </button>
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {recentSearches.map((result) => (
                              <div
                                key={`recent-${result.type}-${result.id}`}
                                role="button"
                                tabIndex={0}
                                onClick={() => handleRecentClick(result)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleRecentClick(result);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted text-left transition-colors border-b border-border/50 last:border-b-0 group cursor-pointer"
                              >
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                                  result.type === 'user' ? 'bg-blue-500/10 text-blue-500' :
                                  result.type === 'payment' ? 'bg-green-500/10 text-green-500' :
                                  'bg-purple-500/10 text-purple-500'
                                }`}>
                                  {result.type === 'user' && <Users className="w-3 h-3" />}
                                  {result.type === 'payment' && <Image className="w-3 h-3" />}
                                  {result.type === 'referral' && <Gift className="w-3 h-3" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-foreground truncate">{result.title}</p>
                                  <p className="text-[10px] text-muted-foreground truncate">{result.subtitle}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => removeRecentSearch(result.id, e)}
                                  className="p-0.5 rounded hover:bg-muted-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity"
                                  aria-label="Remove from recent"
                                >
                                  <X className="w-2.5 h-2.5 text-muted-foreground" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Search Results - show when query exists */}
                      {searchQuery.length >= 2 && (
                        <>
                          {searchResults.length === 0 ? (
                            <div className="p-3 text-center text-muted-foreground text-xs">
                              {searchLoading ? 'Searching...' : 'No results found'}
                            </div>
                          ) : (
                            <div className="max-h-60 overflow-y-auto">
                              {searchResults.map((result) => (
                                <button
                                  key={`${result.type}-${result.id}`}
                                  onClick={() => handleResultClick(result)}
                                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted text-left transition-colors border-b border-border/50 last:border-b-0"
                                >
                                  <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                                    result.type === 'user' ? 'bg-blue-500/10 text-blue-500' :
                                    result.type === 'payment' ? 'bg-green-500/10 text-green-500' :
                                    'bg-purple-500/10 text-purple-500'
                                  }`}>
                                    {result.type === 'user' && <Users className="w-3 h-3" />}
                                    {result.type === 'payment' && <Image className="w-3 h-3" />}
                                    {result.type === 'referral' && <Gift className="w-3 h-3" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-foreground truncate">{result.title}</p>
                                    <p className="text-[10px] text-muted-foreground truncate">{result.subtitle}</p>
                                  </div>
                                  <span className="text-[10px] text-muted-foreground capitalize px-1.5 py-0.5 bg-muted rounded">
                                    {result.type}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {/* Pending Payments Shortcut */}
                  <button
                    onClick={() => setCurrentView('payments')}
                    className={`relative flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                      currentView === 'payments'
                        ? 'bg-primary text-white'
                        : 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/20'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Pending</span>
                    {pendingCount > 0 && (
                      <span className="min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold animate-pulse">
                        {pendingCount > 99 ? '99+' : pendingCount}
                      </span>
                    )}
                  </button>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[10px] font-bold">{user?.email?.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="admin-content-area flex-1 overflow-y-auto p-2 sm:p-4 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
            {renderContent()}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminPanel;