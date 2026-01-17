import React, { useState } from 'react';
import { Bell, Eye, EyeOff, ArrowUp, Check, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ServiceIcon from './ServiceIcon';
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
    { icon: "💳", label: "Buy PAY ID", page: "buyPayId" },
    { icon: "📺", label: "Watch", action: handleWatchVideo },
    { icon: "📊", label: "Airtime", page: "airtime" },
    { icon: "🗄️", label: "Data", page: "data" },
    { icon: "🎧", label: "Support", page: "support" },
    { icon: "🌐", label: "Group", page: "joinCommunities" },
    { icon: "💰", label: "Earn More", page: "earnMore" },
    { icon: "👤", label: "Profile", page: "profile" }
  ];

  const handleServiceClick = (service: any) => {
    if (service.action) {
      service.action();
    } else {
      onNavigate(service.page);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-paygo-lavender w-full overflow-x-hidden">
      {/* Animated Header with moving text */}
      <div className="glass-header text-white py-1.5 text-xs overflow-hidden relative w-full">
        <div className="animate-marquee whitespace-nowrap">
          Dear User, We're currently experiencing issues with <span className="text-purple-200 font-semibold">Opay</span> bank transfers. Please use other banks for your payments.
        </div>
      </div>

      <div className="p-4 space-y-4 w-full max-w-md mx-auto">
        <div className="flex justify-center mb-2 overflow-hidden">
          <div className="animate-slide-logo">
            <img 
              src="/lovable-uploads/19396cc7-ffeb-4564-ba8f-a6d4eff13269.png" 
              alt="PayGo Logo"
              className="h-10 object-contain"
            />
          </div>
        </div>

        {/* Main Card with Glassmorphism */}
        <div className="gradient-purple rounded-2xl p-4 text-white shadow-xl relative overflow-hidden">
          {/* Glass overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {userProfileImage ? (
                  <img 
                    src={userProfileImage} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
                  />
                ) : (
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium">Hi, {userName}</span>
                    <span className="text-lg">👋</span>
                  </div>
                  <p className="text-xs opacity-90">Welcome back!</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-purple-200" />
                <button onClick={onLogout} className="text-xs glass-button px-2 py-1 rounded-full text-white">
                  Logout
                </button>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs opacity-90 mb-1">Your Balance</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold">
                    {balanceVisible ? currentBalance : "****"}
                  </span>
                  <button 
                    onClick={() => setBalanceVisible(!balanceVisible)}
                    className="text-white hover:text-purple-200"
                  >
                    {balanceVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <p className="text-xs opacity-75 mt-1">Weekly Rewards: {weeklyRewards}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={() => onNavigate('upgradeAccount')}
                className="glass-button hover:bg-white/30 text-white border-0 rounded-full h-8 flex items-center justify-center space-x-2"
              >
                <div className="w-4 h-4 bg-white/30 rounded-full flex items-center justify-center">
                  <Check className="w-2 h-2" />
                </div>
                <span className="text-sm">Upgrade</span>
              </Button>
              <Button 
                onClick={() => onNavigate('transferToBank')}
                className="glass-button hover:bg-white/30 text-white border-0 rounded-full h-8 flex items-center justify-center space-x-2"
              >
                <div className="w-4 h-4 bg-white/30 rounded-full flex items-center justify-center">
                  <ArrowUp className="w-2 h-2" />
                </div>
                <span className="text-sm">Transfer</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Services Grid with Glass Cards */}
        <div className="grid grid-cols-4 gap-3">
          {services.map((service, index) => (
            <ServiceIcon
              key={index}
              icon={service.icon}
              label={service.label}
              onClick={() => handleServiceClick(service)}
            />
          ))}
        </div>

        <div>
          <h2 className="text-base font-bold text-foreground mb-3">Current Promotions</h2>
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
