import React, { useState, useEffect } from 'react';
import { Bell, Eye, EyeOff, ArrowUpRight, Sparkles, User, CreditCard, Play, Phone, Database, Headphones, Globe, Gift, UserCircle, LogOut, TrendingUp, Zap, Star, ChevronRight } from 'lucide-react';
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
  userEmail,
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
    <div className="min-h-screen min-h-[100dvh] bg-background w-full overflow-x-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-lavender/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating Alert Banner */}
      <div className={`mx-4 mt-3 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="relative overflow-hidden glass rounded-2xl border border-red-500/20 bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent px-4 py-2.5">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent" />
          <div className="relative flex items-center gap-3">
            <div className="relative">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <div className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-red-400 animate-ping" />
            </div>
            <p className="text-xs text-foreground/90 font-medium">
              <span className="text-red-400 font-semibold">Opay</span> transfers temporarily unavailable
            </p>
            <ChevronRight className="w-4 h-4 text-red-400/60 ml-auto" />
          </div>
        </div>
      </div>

      <div className="relative px-4 pt-5 pb-8 space-y-6 w-full max-w-md mx-auto">
        {/* Header with Logo and Actions */}
        <div className={`flex items-center justify-between transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="relative">
            <img 
              src="/lovable-uploads/19396cc7-ffeb-4564-ba8f-a6d4eff13269.png" 
              alt="PayGo Logo"
              className="h-10 object-contain drop-shadow-lg"
            />
            <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-lavender/30 to-transparent rounded-full blur-sm" />
          </div>
          <div className="flex items-center gap-2">
            <button className="relative glass w-11 h-11 rounded-2xl flex items-center justify-center border border-white/10 hover:border-primary/40 transition-all duration-300 hover:scale-105 group">
              <Bell className="w-5 h-5 text-foreground/70 group-hover:text-primary transition-colors" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full border-2 border-background" />
            </button>
            <button 
              onClick={onLogout}
              className="glass w-11 h-11 rounded-2xl flex items-center justify-center border border-white/10 hover:border-red-500/40 transition-all duration-300 hover:scale-105 group"
            >
              <LogOut className="w-5 h-5 text-foreground/70 group-hover:text-red-400 transition-colors" />
            </button>
          </div>
        </div>

        {/* User Welcome Card - Enhanced */}
        <div className={`transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-primary via-lavender to-accent rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity" />
              {userProfileImage ? (
                <img 
                  src={userProfileImage} 
                  alt="Profile" 
                  className="relative w-16 h-16 rounded-2xl object-cover border-2 border-white/20"
                />
              ) : (
                <div className="relative w-16 h-16 glass-strong rounded-2xl flex items-center justify-center border border-white/20">
                  <User className="w-7 h-7 text-primary" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/40 border-2 border-background">
                <Zap className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-muted-foreground text-sm">Welcome back</p>
                <div className="px-2 py-0.5 glass rounded-full border border-primary/20">
                  <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Pro</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">{userName}</h2>
            </div>
            <button 
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 glass rounded-xl flex items-center justify-center border border-white/10 hover:border-primary/30 transition-all"
            >
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Modern Balance Card - Premium Design */}
        <div className={`transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="relative overflow-hidden group">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-lavender/20 to-accent/20 rounded-[28px] blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-lavender/10 rounded-[28px]" />
            
            {/* Shine effect */}
            <div className="absolute inset-0 overflow-hidden rounded-[28px]">
              <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-shimmer" />
            </div>
            
            <div className="relative glass-card rounded-[28px] p-6 border border-white/15">
              {/* Top Section */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-lavender/20 flex items-center justify-center">
                      <Star className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">Total Balance</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-bold text-foreground tracking-tight">
                      {balanceVisible ? currentBalance : "₦••••••"}
                    </h1>
                    <button 
                      onClick={() => setBalanceVisible(!balanceVisible)}
                      className="glass w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 hover:border-primary/30 transition-all hover:scale-105 active:scale-95"
                    >
                      {balanceVisible ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                    </button>
                  </div>
                </div>
                <div className="glass px-3 py-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-bold text-emerald-400">+12%</span>
                  </div>
                </div>
              </div>

              {/* Rewards Card */}
              <div className="glass rounded-2xl p-4 border border-white/10 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent mb-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/40">
                        <Gift className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full flex items-center justify-center">
                        <Sparkles className="w-2.5 h-2.5 text-amber-800" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Weekly Rewards Pool</p>
                      <p className="text-lg font-bold text-foreground">{weeklyRewards}</p>
                    </div>
                  </div>
                  <button className="glass px-3 py-1.5 rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition-all">
                    <span className="text-xs font-semibold text-amber-400">Claim</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => onNavigate('upgradeAccount')}
                  className="h-14 rounded-2xl bg-gradient-to-r from-primary via-lavender to-accent hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/40 border-0 group"
                >
                  <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  <span className="font-bold text-base">Upgrade</span>
                </Button>
                <Button 
                  onClick={() => onNavigate('transferToBank')}
                  className="h-14 rounded-2xl glass-strong border border-white/15 hover:border-primary/40 bg-transparent hover:bg-white/5 transition-all duration-300 group"
                >
                  <ArrowUpRight className="w-5 h-5 mr-2 text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  <span className="font-bold text-base text-foreground">Transfer</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Services Grid - Enhanced */}
        <div className={`transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Quick Actions</h3>
            <div className="h-px flex-1 mx-4 bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleServiceClick(service)}
                  className="group flex flex-col items-center gap-2.5 p-3.5 glass rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] active:scale-95 hover:bg-white/5"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg ${service.glow} group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    <IconComponent className="w-5 h-5 text-white drop-shadow-lg" />
                    <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[11px] font-semibold text-foreground/80 text-center leading-tight group-hover:text-foreground transition-colors">{service.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Promotions Section - Enhanced */}
        <div className={`transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-primary to-lavender rounded-full" />
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Hot Deals</h3>
            </div>
            <button className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline group">
              View All
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          <PromotionsCarousel />
        </div>

        {/* Quick Stats Bar */}
        <div className={`transition-all duration-700 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="glass rounded-2xl p-4 border border-white/10 grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">23</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Transactions</p>
            </div>
            <div className="text-center border-x border-white/10">
              <p className="text-2xl font-bold text-emerald-400">5</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Referrals</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">Lv.1</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Status</p>
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