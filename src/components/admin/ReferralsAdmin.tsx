import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Users, Gift, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  bonus_amount: number;
  status: string;
  created_at: string;
  credited_at: string | null;
  referrer_name?: string;
  referrer_email?: string;
  referred_name?: string;
  referred_email?: string;
}

interface ReferralsAdminProps {
  onBack: () => void;
}

const ReferralsAdmin: React.FC<ReferralsAdminProps> = ({ onBack }) => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      // First get referrals
      const { data: referralsData, error: referralsError } = await supabase
        .from('referrals')
        .select('*')
        .order('created_at', { ascending: false });

      if (referralsError) throw referralsError;

      // Get all profiles to map names
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email');

      if (profilesError) throw profilesError;

      const profilesMap = new Map(profilesData?.map(p => [p.id, p]));

      // Map referrals with names
      const enrichedReferrals = referralsData?.map(ref => ({
        ...ref,
        referrer_name: profilesMap.get(ref.referrer_id)?.name || 'Unknown',
        referrer_email: profilesMap.get(ref.referrer_id)?.email || '',
        referred_name: profilesMap.get(ref.referred_id)?.name || 'Unknown',
        referred_email: profilesMap.get(ref.referred_id)?.email || '',
      })) || [];

      setReferrals(enrichedReferrals);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      toast({
        title: "Error",
        description: "Could not load referrals",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const totalBonus = referrals.reduce((sum, r) => sum + r.bonus_amount, 0);
  const creditedReferrals = referrals.filter(r => r.status === 'credited').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass-header text-foreground p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack}>
              <ArrowLeft className="w-6 h-6 text-primary" />
            </button>
            <h1 className="text-xl font-semibold">Referrals</h1>
          </div>
          <button 
            onClick={fetchReferrals}
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
            <Users className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xl font-bold text-foreground">{referrals.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-xl font-bold text-foreground">{creditedReferrals}</p>
            <p className="text-xs text-muted-foreground">Credited</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <Gift className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <p className="text-xl font-bold text-foreground">₦{totalBonus.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Bonuses</p>
          </div>
        </div>

        {/* Referrals List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : referrals.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No referrals yet</p>
          </div>
        ) : (
          referrals.map((referral) => (
            <div 
              key={referral.id}
              className="glass-card rounded-2xl p-4 border border-border/50"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
                  referral.status === 'credited' 
                    ? 'text-green-500 bg-green-500/10' 
                    : 'text-amber-500 bg-amber-500/10'
                }`}>
                  {referral.status === 'credited' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                  <span className="text-xs font-medium capitalize">{referral.status}</span>
                </div>
                <p className="text-lg font-bold text-green-500">+₦{referral.bonus_amount.toLocaleString()}</p>
              </div>

              <div className="space-y-2">
                <div className="glass rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Referrer (Earned Bonus)</p>
                  <p className="text-foreground font-medium">{referral.referrer_name}</p>
                  <p className="text-muted-foreground text-sm">{referral.referrer_email}</p>
                </div>

                <div className="flex justify-center">
                  <div className="w-0.5 h-4 bg-primary/30" />
                </div>

                <div className="glass rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Referred (New User)</p>
                  <p className="text-foreground font-medium">{referral.referred_name}</p>
                  <p className="text-muted-foreground text-sm">{referral.referred_email}</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                {new Date(referral.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReferralsAdmin;
