import React, { useState, useEffect } from 'react';
import { Bell, Eye, EyeOff, ArrowUpRight, Sparkles, User, CreditCard, Play, Phone, Database, Headphones, Globe, Gift, UserCircle, LogOut, TrendingUp, Zap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PromotionsCarousel from './PromotionsCarousel';
import OnboardingModal from './OnboardingModal';
import VideoPlayer from './VideoPlayer';

interface DashboardProps {
  userName: string;
  userEmail: string;
  userProfileImage: string | null;
  showOnboarding: boolean;
  onboardingStep: number;
  onNextOnboarding: () => void;
  onCloseOnboarding: () => void;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  currentBalance: string;
}

const Dashboard: React.FC<DashboardProps> = ({
  userName,
  userEmail: _userEmail,
  userProfileImage,
  showOnboarding,
  onboardingStep,
  onNextOnboarding,
  onCloseOnboarding,
  onNavigate,
  onLogout,
  currentBalance
}) => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [mounted, setMounted] = useState(false);
  const weeklyRewards = "₦180,000.00";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleWatchVideo = () => {
    setShowVideo(true);
  };

  const handleCloseVideo = () => {
    setShowVideo(false);
  };

  const services = [
    { icon: CreditCard, label: "Buy PAY ID", page: "buyPayId", gradient: "from-violet-500 via-purple-500 to-fuchsia-500", glow: "shadow-violet-500/40" },
    { icon: Play, label: "Watch", action: handleWatchVideo, gradient: "from-rose-500 via-pink-500 to-red-500", glow: "shadow-rose-500/40" },
    { icon: Phone, label: "Airtime", page: "airtime", gradient: "from-emerald-500 via-green-500 to-teal-500", glow: "shadow-emerald-500/40" },
    { icon: Database, label: "Data", page: "data", gradient: "from-cyan-500 via-blue-500 to-indigo-500", glow: "shadow-cyan-500/40" },
    { icon: Headphones, label: "Support", page: "support", gradient: "from-amber-500 via-orange-500 to-yellow-500", glow: "shadow-amber-500/40" },
    { icon: Globe, label: "Group", page: "joinCommunities", gradient: "from-indigo-500 via-purple-500 to-violet-500", glow: "shadow-indigo-500/40" },
    { icon: Gift, label: "Earn More", page: "earnMore", gradient: "from-pink-500 via-fuchsia-500 to-purple-500", glow: "shadow-pink-500/40" },
    { icon: UserCircle, label: "Profile", page: "profile", gradient: "from-slate-400 via-gray-500 to-zinc-600", glow: "shadow-slate-500/40" }
  ];

  const handleServiceClick = (service: any) => {
    if (service.action) {
      service.action();
    } else {
      onNavigate(service.page);
    }
  };

  return (
    <div className="h-screen h-[100dvh] bg-background w-full overflow-x-hidden overflow-y-auto relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-[60px] animate-pulse" />
        <div className="absolute top-1/3 -left-10 w-32 h-32 bg-lavender/10 rounded-full blur-[50px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Floating Alert Banner */}
      <div className={`mx-3 mt-2 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="relative overflow-hidden glass rounded-xl border border-red-500/20 bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent px-3 py-2">
          <div className="relative flex items-center gap-2">
            <div className="relative">
              <div className="h-2 w-2 rounded-full bg-red-400" />
              <div className="absolute inset-0 h-2 w-2 rounded-full bg-red-400 animate-ping" />
            </div>
            <p className="text-[10px] text-foreground/90 font-medium">
              <span className="text-red-400 font-semibold">Opay</span> transfers temporarily unavailable
            </p>
            <ChevronRight className="w-3 h-3 text-red-400/60 ml-auto" />
          </div>
        </div>
      </div>

      <div className="relative px-3 pt-3 pb-4 space-y-3 w-full max-w-md mx-auto">
        {/* Header with Logo and Actions */}
        <div className={`flex items-center justify-between transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <img 
            src="/lovable-uploads/19396cc7-ffeb-4564-ba8f-a6d4eff13269.png" 
            alt="PayGo Logo"
            className="h-8 object-contain drop-shadow-lg"
          />
          <div className="flex items-center gap-1.5">
            <button className="relative glass w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 hover:border-primary/40 transition-all">
              <Bell className="w-4 h-4 text-foreground/70" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button 
              onClick={onLogout}
              className="glass w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 hover:border-red-500/40 transition-all"
            >
              <LogOut className="w-4 h-4 text-foreground/70" />
            </button>
          </div>
        </div>

        {/* User Welcome Card */}
        <div className={`transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="flex items-center gap-3">
            <div className="relative">
              {userProfileImage ? (
                <img src={userProfileImage} alt="Profile" className="w-11 h-11 rounded-xl object-cover border border-white/20" />
              ) : (
                <div className="w-11 h-11 glass-strong rounded-xl flex items-center justify-center border border-white/20">
                  <User className="w-5 h-5 text-primary" />
                </div>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Zap className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground text-[10px]">Welcome back</p>
              <h2 className="text-lg font-bold text-foreground">{userName}</h2>
            </div>
            <button 
              onClick={() => onNavigate('profile')}
              className="w-8 h-8 glass rounded-lg flex items-center justify-center border border-white/10"
            >
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Compact Balance Card */}
        <div className={`transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="relative overflow-hidden glass-card rounded-2xl p-4 border border-white/15">
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-shimmer" />
            </div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-muted-foreground text-[10px] font-medium mb-0.5">Total Balance</p>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-foreground">
                      {balanceVisible ? currentBalance : "₦••••••"}
                    </h1>
                    <button 
                      onClick={() => setBalanceVisible(!balanceVisible)}
                      className="glass w-7 h-7 rounded-lg flex items-center justify-center border border-white/10"
                    >
                      {balanceVisible ? <EyeOff className="w-3.5 h-3.5 text-muted-foreground" /> : <Eye className="w-3.5 h-3.5 text-muted-foreground" />}
                    </button>
                  </div>
                </div>
                <div className="glass px-2 py-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400">+12%</span>
                  </div>
                </div>
              </div>

              {/* Rewards Row */}
              <div className="glass rounded-xl p-2.5 border border-white/10 bg-gradient-to-r from-amber-500/10 to-transparent mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <Gift className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground">Weekly Rewards</p>
                      <p className="text-sm font-bold text-foreground">{weeklyRewards}</p>
                    </div>
                  </div>
                  <button className="glass px-2 py-1 rounded-lg border border-amber-500/20">
                    <span className="text-[10px] font-semibold text-amber-400">Claim</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={() => onNavigate('upgradeAccount')}
                  className="h-10 rounded-xl bg-gradient-to-r from-primary via-lavender to-accent hover:opacity-90 transition-all shadow-lg shadow-primary/30 border-0"
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  <span className="font-bold text-sm">Upgrade</span>
                </Button>
                <Button 
                  onClick={() => onNavigate('transferToBank')}
                  className="h-10 rounded-xl glass-strong border border-white/15 bg-transparent hover:bg-white/5 transition-all"
                >
                  <ArrowUpRight className="w-4 h-4 mr-1.5 text-primary" />
                  <span className="font-bold text-sm text-foreground">Transfer</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid - Compact */}
        <div className={`transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[10px] font-bold text-foreground uppercase tracking-wider">Quick Actions</h3>
            <div className="h-px flex-1 mx-3 bg-gradient-to-r from-white/10 to-transparent" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleServiceClick(service)}
                  className="group flex flex-col items-center gap-1.5 p-2.5 glass rounded-xl border border-white/5 hover:border-white/20 transition-all active:scale-95"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-md ${service.glow}`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[9px] font-semibold text-foreground/80 text-center leading-tight">{service.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Promotions Section - Compact */}
        <div className={`transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-0.5 h-3 bg-gradient-to-b from-primary to-lavender rounded-full" />
              <h3 className="text-[10px] font-bold text-foreground uppercase tracking-wider">Hot Deals</h3>
            </div>
            <button className="flex items-center gap-0.5 text-[10px] text-primary font-semibold">
              View All
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <PromotionsCarousel />
        </div>

        {/* Quick Stats Bar - Compact */}
        <div className={`transition-all duration-700 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="glass rounded-xl p-3 border border-white/10 grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">23</p>
              <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Transactions</p>
            </div>
            <div className="text-center border-x border-white/10">
              <p className="text-lg font-bold text-emerald-400">5</p>
              <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Referrals</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-primary">Lv.1</p>
              <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Status</p>
            </div>
          </div>
        </div>
      </div>

      {showOnboarding && (
        <OnboardingModal
          currentStep={onboardingStep}
          onNext={onNextOnboarding}
          onClose={onCloseOnboarding}
          userName={userName}
        />
      )}

      {showVideo && (
        <VideoPlayer
          videoUrl="https://vimeo.com/1092911696/799f03cd7d?share=copy"
          onClose={handleCloseVideo}
        />
      )}
    </div>
  );
};

export default Dashboard;