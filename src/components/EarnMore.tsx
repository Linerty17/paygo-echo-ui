import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Users, Gift, Share2, Check, Loader2, MessageCircle, Send, Twitter, Facebook, Mail, Link2 } from 'lucide-react';
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
  const [linkCopied, setLinkCopied] = useState(false);

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

  const getReferralLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/?ref=${referralCode}`;
  };

  const getShareMessage = () => {
    return `🎉 Join PayGo using my referral code: ${referralCode} and we both earn ₦2,500! Download now and start earning! 💰\n\n${getReferralLink()}`;
  };

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

  const handleCopyLink = async () => {
    if (!referralCode) return;
    
    try {
      await navigator.clipboard.writeText(getReferralLink());
      setLinkCopied(true);
      toast.success('Referral link copied!');
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleShareWhatsApp = () => {
    if (!referralCode) return;
    const message = encodeURIComponent(getShareMessage());
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleShareTelegram = () => {
    if (!referralCode) return;
    const message = encodeURIComponent(getShareMessage());
    window.open(`https://t.me/share/url?url=&text=${message}`, '_blank');
  };

  const handleShareTwitter = () => {
    if (!referralCode) return;
    const message = encodeURIComponent(getShareMessage());
    window.open(`https://twitter.com/intent/tweet?text=${message}`, '_blank');
  };

  const handleShareFacebook = () => {
    if (!referralCode) return;
    const message = encodeURIComponent(getShareMessage());
    window.open(`https://www.facebook.com/sharer/sharer.php?quote=${message}`, '_blank');
  };

  const handleShareEmail = () => {
    if (!referralCode) return;
    const subject = encodeURIComponent('Join PayGo and earn ₦2,500!');
    const body = encodeURIComponent(getShareMessage());
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const handleShareNative = async () => {
    if (!referralCode) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join PayGo',
          text: getShareMessage(),
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
      {/* Modern Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="glass w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10 hover:border-primary/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Earn More</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-4 pb-8 space-y-5">
        {/* Hero Card */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-lavender/10 to-primary/5 rounded-3xl" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          
          <div className="relative glass rounded-3xl p-6 border border-white/10 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-lavender flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Invite & Earn</h2>
            <p className="text-muted-foreground">
              Get <span className="text-primary font-bold">₦2,500</span> for each friend!
            </p>

            {/* Referral Code */}
            <div className="mt-5 glass rounded-2xl p-4 border border-primary/20">
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Your Referral Code</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-bold text-primary tracking-widest">
                  {referralCode || '...'}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="w-10 h-10 rounded-xl glass border border-primary/20 flex items-center justify-center hover:bg-primary/10 transition-all"
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

            {/* Referral Link */}
            <div className="mt-3 glass rounded-2xl p-4 border border-white/10">
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Referral Link</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 glass rounded-xl px-3 py-2 overflow-hidden border border-white/5">
                  <p className="text-sm text-foreground truncate">
                    {referralCode ? getReferralLink() : '...'}
                  </p>
                </div>
                <Button
                  onClick={handleCopyLink}
                  size="sm"
                  className="flex-shrink-0 h-10 rounded-xl bg-gradient-to-r from-primary to-lavender border-0"
                  disabled={!referralCode}
                >
                  {linkCopied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Share */}
        <div className="glass rounded-3xl p-5 border border-white/10">
          <p className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider text-center">Share Via</p>
          <div className="grid grid-cols-5 gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl glass hover:scale-105 transition-all"
              disabled={!referralCode}
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
            </button>
            
            <button
              onClick={handleShareTelegram}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl glass hover:scale-105 transition-all"
              disabled={!referralCode}
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <Send className="w-5 h-5 text-white" />
              </div>
            </button>
            
            <button
              onClick={handleShareTwitter}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl glass hover:scale-105 transition-all"
              disabled={!referralCode}
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                <Twitter className="w-5 h-5 text-white" />
              </div>
            </button>
            
            <button
              onClick={handleShareFacebook}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl glass hover:scale-105 transition-all"
              disabled={!referralCode}
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                <Facebook className="w-5 h-5 text-white" />
              </div>
            </button>
            
            <button
              onClick={handleShareEmail}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl glass hover:scale-105 transition-all"
              disabled={!referralCode}
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-lavender flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
            </button>
          </div>

          <Button
            onClick={handleShareNative}
            className="w-full h-12 mt-4 rounded-2xl bg-gradient-to-r from-primary to-lavender hover:opacity-90 text-white font-semibold shadow-lg border-0"
            disabled={!referralCode}
          >
            <Share2 className="w-5 h-5 mr-2" />
            More Options
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass rounded-2xl p-4 border border-white/10 text-center">
            <div className="w-11 h-11 mx-auto rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-foreground">{referrals.length}</p>
            <p className="text-xs text-muted-foreground">Total Referrals</p>
          </div>
          
          <div className="glass rounded-2xl p-4 border border-white/10 text-center">
            <div className="w-11 h-11 mx-auto rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-2">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-foreground">₦{totalEarnings.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Earned</p>
          </div>
        </div>

        {/* Referral List */}
        <div className="glass rounded-3xl overflow-hidden border border-white/10">
          <div className="p-4 border-b border-white/5">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Your Referrals</h3>
          </div>
          
          {loading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : referrals.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No referrals yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Share your code to start earning!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {referrals.map((referral) => (
                <div key={referral.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {referral.referred_profile?.name || 'Anonymous'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(referral.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-400">
                      +₦{referral.bonus_amount.toLocaleString()}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      referral.status === 'credited' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {referral.status === 'credited' ? 'Credited' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="glass rounded-3xl p-5 border border-white/10">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">How It Works</h3>
          
          <div className="space-y-4">
            {[
              'Share your unique referral code',
              'Friends sign up using your code',
              'Earn ₦2,500 for each referral!'
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-lavender flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-muted-foreground text-sm">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarnMore;
