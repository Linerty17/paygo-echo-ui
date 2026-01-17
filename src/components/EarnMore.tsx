import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Users, Gift, Share2, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  bonus_amount: number;
  status: string;
  created_at: string;
  credited_at: string | null;
  referred_profile?: {
    name: string;
    email: string;
  };
}

interface EarnMoreProps {
  onBack: () => void;
  referralCode: string | null;
  fetchReferrals: () => Promise<Referral[]>;
}

const EarnMore: React.FC<EarnMoreProps> = ({ onBack, referralCode, fetchReferrals }) => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadReferrals();
  }, []);

  const loadReferrals = async () => {
    setLoading(true);
    const data = await fetchReferrals();
    setReferrals(data);
    setLoading(false);
  };

  const totalEarnings = referrals
    .filter(r => r.status === 'credited')
    .reduce((sum, r) => sum + r.bonus_amount, 0);

  const handleCopyCode = async () => {
    if (!referralCode) return;
    
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast.success('Referral code copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy code');
    }
  };

  const handleShare = async () => {
    if (!referralCode) return;
    
    const shareText = `Join PayGo using my referral code: ${referralCode} and we both earn ₦2,500! 🎉`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join PayGo',
          text: shareText,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          handleCopyCode();
        }
      }
    } else {
      handleCopyCode();
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass-header p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Earn More</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Referral Code Card */}
        <div className="glass-card p-6 rounded-2xl text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
            <Gift className="w-8 h-8 text-primary" />
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-foreground">Invite & Earn</h2>
            <p className="text-muted-foreground mt-1">
              Get <span className="text-primary font-bold">₦2,500</span> for each friend you refer!
            </p>
          </div>

          <div className="bg-background/50 rounded-xl p-4 border border-primary/30">
            <p className="text-sm text-muted-foreground mb-2">Your Referral Code</p>
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl font-bold text-primary tracking-wider">
                {referralCode || 'Loading...'}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-2 hover:bg-primary/20 rounded-lg transition-colors"
                disabled={!referralCode}
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-primary" />
                )}
              </button>
            </div>
          </div>

          <Button
            onClick={handleShare}
            className="w-full h-14 bg-primary hover:bg-primary/80 text-primary-foreground text-lg font-medium rounded-xl transition-colors lavender-glow"
            disabled={!referralCode}
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Referral Code
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-4 rounded-xl text-center">
            <Users className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{referrals.length}</p>
            <p className="text-sm text-muted-foreground">Total Referrals</p>
          </div>
          
          <div className="glass-card p-4 rounded-xl text-center">
            <Gift className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">₦{totalEarnings.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Earned</p>
          </div>
        </div>

        {/* Referral List */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-foreground">Your Referrals</h3>
          </div>
          
          {loading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : referrals.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No referrals yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Share your code to start earning!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {referrals.map((referral) => (
                <div key={referral.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {referral.referred_profile?.name || 'Anonymous'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(referral.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-400">
                      +₦{referral.bonus_amount.toLocaleString()}
                    </p>
                    <p className={`text-xs ${
                      referral.status === 'credited' ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {referral.status === 'credited' ? 'Credited' : 'Pending'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="text-lg font-semibold text-foreground">How It Works</h3>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">
                1
              </div>
              <p className="text-muted-foreground">Share your unique referral code with friends</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">
                2
              </div>
              <p className="text-muted-foreground">They sign up using your code</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">
                3
              </div>
              <p className="text-muted-foreground">You earn ₦2,500 instantly for each referral!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarnMore;
