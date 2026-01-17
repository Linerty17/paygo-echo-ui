import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Users, Wallet, Gift, TrendingUp, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface StatsAdminProps {
  onBack: () => void;
}

const StatsAdmin: React.FC<StatsAdminProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBalance: 0,
    totalReferrals: 0,
    totalBonuses: 0,
    pendingPayments: 0,
    approvedPayments: 0,
    declinedPayments: 0,
    todayUsers: 0,
    thisWeekUsers: 0,
  });

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('balance, created_at');

      if (profilesError) throw profilesError;

      // Fetch all referrals
      const { data: referrals, error: referralsError } = await supabase
        .from('referrals')
        .select('bonus_amount');

      if (referralsError) throw referralsError;

      // Fetch all payment uploads
      const { data: payments, error: paymentsError } = await supabase
        .from('payment_uploads')
        .select('status');

      if (paymentsError) throw paymentsError;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      weekAgo.setHours(0, 0, 0, 0);

      const todayUsers = profiles?.filter(p => new Date(p.created_at) >= today).length || 0;
      const thisWeekUsers = profiles?.filter(p => new Date(p.created_at) >= weekAgo).length || 0;

      setStats({
        totalUsers: profiles?.length || 0,
        totalBalance: profiles?.reduce((sum, p) => sum + (p.balance || 0), 0) || 0,
        totalReferrals: referrals?.length || 0,
        totalBonuses: referrals?.reduce((sum, r) => sum + (r.bonus_amount || 0), 0) || 0,
        pendingPayments: payments?.filter(p => p.status === 'pending').length || 0,
        approvedPayments: payments?.filter(p => p.status === 'approved').length || 0,
        declinedPayments: payments?.filter(p => p.status === 'declined').length || 0,
        todayUsers,
        thisWeekUsers,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Could not load statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats.totalUsers, color: 'text-primary', bg: 'from-primary/20 to-primary/5' },
    { icon: Wallet, label: 'Total Balance', value: `₦${stats.totalBalance.toLocaleString()}`, color: 'text-green-500', bg: 'from-green-500/20 to-green-500/5' },
    { icon: Gift, label: 'Referral Bonuses', value: `₦${stats.totalBonuses.toLocaleString()}`, color: 'text-amber-500', bg: 'from-amber-500/20 to-amber-500/5' },
    { icon: TrendingUp, label: 'Total Referrals', value: stats.totalReferrals, color: 'text-blue-500', bg: 'from-blue-500/20 to-blue-500/5' },
    { icon: Calendar, label: 'Today Signups', value: stats.todayUsers, color: 'text-purple-500', bg: 'from-purple-500/20 to-purple-500/5' },
    { icon: Users, label: 'This Week', value: stats.thisWeekUsers, color: 'text-cyan-500', bg: 'from-cyan-500/20 to-cyan-500/5' },
  ];

  const paymentStats = [
    { icon: Clock, label: 'Pending', value: stats.pendingPayments, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { icon: CheckCircle, label: 'Approved', value: stats.approvedPayments, color: 'text-green-500', bg: 'bg-green-500/10' },
    { icon: XCircle, label: 'Declined', value: stats.declinedPayments, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

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
              <h1 className="text-xl font-semibold">Dashboard Stats</h1>
            </div>
            <button 
              onClick={fetchStats}
              className="glass w-10 h-10 rounded-xl flex items-center justify-center"
            >
              <RefreshCw className={`w-5 h-5 text-primary ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      )}

      <div className="p-4 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {statCards.map((stat, index) => (
                <div 
                  key={index}
                  className={`glass-card rounded-2xl p-4 bg-gradient-to-br ${stat.bg} border border-border/50`}
                >
                  <stat.icon className={`w-8 h-8 ${stat.color} mb-2`} />
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Payment Stats */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Payment Uploads</h3>
              <div className="grid grid-cols-3 gap-3">
                {paymentStats.map((stat, index) => (
                  <div 
                    key={index}
                    className={`glass-card rounded-xl p-4 text-center ${stat.bg}`}
                  >
                    <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Card */}
            <div className="glass-card rounded-2xl p-6 border border-primary/20">
              <h3 className="text-lg font-semibold text-foreground mb-4">Platform Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Average Balance per User</span>
                  <span className="text-foreground font-semibold">
                    ₦{stats.totalUsers > 0 ? Math.round(stats.totalBalance / stats.totalUsers).toLocaleString() : 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Referral Conversion</span>
                  <span className="text-foreground font-semibold">
                    {stats.totalUsers > 0 ? ((stats.totalReferrals / stats.totalUsers) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Payment Approval Rate</span>
                  <span className="text-green-500 font-semibold">
                    {(stats.approvedPayments + stats.declinedPayments) > 0 
                      ? ((stats.approvedPayments / (stats.approvedPayments + stats.declinedPayments)) * 100).toFixed(1) 
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StatsAdmin;
