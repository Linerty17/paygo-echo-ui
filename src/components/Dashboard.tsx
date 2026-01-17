import React, { useState } from 'react';
import { Bell, Eye, EyeOff, ArrowUpRight, Sparkles, User, CreditCard, Play, Phone, Database, Headphones, Globe, Gift, UserCircle, LogOut, TrendingUp } from 'lucide-react';
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
  const weeklyRewards = "₦180,000.00";

  const handleWatchVideo = () => {
    setShowVideo(true);
  };

  const handleCloseVideo = () => {
    setShowVideo(false);
  };

  const services = [
    { icon: CreditCard, label: "Buy PAY ID", page: "buyPayId", gradient: "from-violet-500 to-purple-600" },
    { icon: Play, label: "Watch", action: handleWatchVideo, gradient: "from-pink-500 to-rose-600" },
    { icon: Phone, label: "Airtime", page: "airtime", gradient: "from-emerald-500 to-teal-600" },
    { icon: Database, label: "Data", page: "data", gradient: "from-blue-500 to-cyan-600" },
    { icon: Headphones, label: "Support", page: "support", gradient: "from-amber-500 to-orange-600" },
    { icon: Globe, label: "Group", page: "joinCommunities", gradient: "from-indigo-500 to-violet-600" },
    { icon: Gift, label: "Earn More", page: "earnMore", gradient: "from-fuchsia-500 to-pink-600" },
    { icon: UserCircle, label: "Profile", page: "profile", gradient: "from-slate-500 to-gray-600" }
  ];

  const handleServiceClick = (service: any) => {
    if (service.action) {
      service.action();
    } else {
      onNavigate(service.page);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background w-full overflow-x-hidden">
      {/* Modern Floating Alert Banner */}
      <div className="mx-4 mt-3">
        <div className="glass rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
            <p className="text-xs text-foreground/80">
              <span className="text-red-400 font-medium">Opay</span> transfers temporarily unavailable
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-8 space-y-5 w-full max-w-md mx-auto">
        {/* Header with Logo and Actions */}
        <div className="flex items-center justify-between">
          <div className="animate-slide-logo">
            <img 
              src="/lovable-uploads/19396cc7-ffeb-4564-ba8f-a6d4eff13269.png" 
              alt="PayGo Logo"
              className="h-9 object-contain"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="glass w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10 hover:border-primary/30 transition-all duration-300 hover:scale-105">
              <Bell className="w-4 h-4 text-foreground/70" />
            </button>
            <button 
              onClick={onLogout}
              className="glass w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10 hover:border-red-500/30 transition-all duration-300 hover:scale-105"
            >
              <LogOut className="w-4 h-4 text-foreground/70" />
            </button>
          </div>
        </div>

        {/* User Welcome Card */}
        <div className="flex items-center gap-3">
          <div className="relative">
            {userProfileImage ? (
              <img 
                src={userProfileImage} 
                alt="Profile" 
                className="w-14 h-14 rounded-2xl object-cover border-2 border-primary/30 shadow-lg shadow-primary/20"
              />
            ) : (
              <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center border border-primary/30 shadow-lg shadow-primary/20">
                <User className="w-6 h-6 text-primary" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-muted-foreground text-sm">Welcome back</p>
            <h2 className="text-xl font-bold text-foreground tracking-tight">{userName} 👋</h2>
          </div>
        </div>

        {/* Modern Balance Card */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-lavender/10 to-primary/5 rounded-3xl" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-lavender/20 rounded-full blur-2xl" />
          
          <div className="relative glass rounded-3xl p-5 border border-white/10 backdrop-blur-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-1">Total Balance</p>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-foreground tracking-tight">
                    {balanceVisible ? currentBalance : "₦••••••"}
                  </h1>
                  <button 
                    onClick={() => setBalanceVisible(!balanceVisible)}
                    className="glass w-8 h-8 rounded-xl flex items-center justify-center border border-white/10 hover:border-primary/30 transition-all"
                  >
                    {balanceVisible ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
              </div>
              <div className="glass px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-400">+12%</span>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-3 border border-white/5 bg-white/5 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <Gift className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Weekly Rewards</p>
                    <p className="text-sm font-semibold text-foreground">{weeklyRewards}</p>
                  </div>
                </div>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => onNavigate('upgradeAccount')}
                className="h-12 rounded-2xl bg-gradient-to-r from-primary to-lavender hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/30 border-0"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                <span className="font-semibold">Upgrade</span>
              </Button>
              <Button 
                onClick={() => onNavigate('transferToBank')}
                className="h-12 rounded-2xl glass border border-white/10 hover:border-primary/30 bg-transparent hover:bg-white/5 transition-all duration-300"
              >
                <ArrowUpRight className="w-4 h-4 mr-2 text-primary" />
                <span className="font-semibold text-foreground">Transfer</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Modern Services Grid */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Quick Actions</h3>
          <div className="grid grid-cols-4 gap-3">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleServiceClick(service)}
                  className="group flex flex-col items-center gap-2 p-3 glass rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[11px] font-medium text-foreground/80 text-center leading-tight">{service.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Promotions Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Promotions</h3>
            <button className="text-xs text-primary font-medium hover:underline">View All</button>
          </div>
          <PromotionsCarousel />
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
