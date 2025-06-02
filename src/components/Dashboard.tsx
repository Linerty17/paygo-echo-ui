
import React, { useState } from 'react';
import { Bell, Eye, EyeOff, ArrowUp, Check, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ServiceIcon from './ServiceIcon';
import PromotionsCarousel from './PromotionsCarousel';
import OnboardingModal from './OnboardingModal';

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
  const weeklyRewards = "₦180,000.00";

  const handleWatchTelegram = () => {
    window.open('https://t.me/officialbluepay2025', '_blank');
  };

  const services = [
    { icon: "💳", label: "Buy PAY ID", page: "buyPayId" },
    { icon: "📺", label: "Watch", action: handleWatchTelegram },
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
    <div className="min-h-screen bg-gray-50">
      {/* Animated Header with moving text - Updated styling */}
      <div className="bg-red-500 text-white py-2 text-sm overflow-hidden relative">
        <div className="animate-marquee whitespace-nowrap">
          Dear User, We're currently experiencing issues with <span className="text-red-200 font-semibold">Opay</span> bank transfers. Please use other banks for your payments.
        </div>
      </div>

      <div className="p-3 space-y-4">
        {/* Animated PayGo Logo - Reduced spacing */}
        <div className="flex justify-center mb-3 overflow-hidden">
          <div className="animate-slide-logo">
            <img 
              src="/lovable-uploads/19396cc7-ffeb-4564-ba8f-a6d4eff13269.png" 
              alt="PayGo Logo"
              className="h-12 object-contain"
            />
          </div>
        </div>

        {/* Balance Card - Adjusted proportions to match image */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-2xl p-5 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {userProfileImage ? (
                <img 
                  src={userProfileImage} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-white border-opacity-30"
                />
              ) : (
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-base font-medium">Hi, {userName}</span>
                  <span className="text-xl">👋</span>
                </div>
                <p className="text-xs opacity-90">Welcome back!</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-orange-400" />
              <button onClick={onLogout} className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                Logout
              </button>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs opacity-90 mb-1">Your Balance</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold">
                  {balanceVisible ? currentBalance : "****"}
                </span>
                <button 
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="text-white hover:text-gray-200"
                >
                  {balanceVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <p className="text-xs opacity-75 mt-1">Weekly Rewards: {weeklyRewards}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => onNavigate('upgradeAccount')}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-0 rounded-full h-10 flex items-center justify-center space-x-2"
            >
              <div className="w-5 h-5 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span className="text-sm">Upgrade</span>
            </Button>
            <Button 
              onClick={() => onNavigate('transferToBank')}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-0 rounded-full h-10 flex items-center justify-center space-x-2"
            >
              <div className="w-5 h-5 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                <ArrowUp className="w-2.5 h-2.5" />
              </div>
              <span className="text-sm">Transfer</span>
            </Button>
          </div>
        </div>

        {/* Services Grid - Reduced spacing */}
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

        {/* Current Promotions - Reduced spacing and size */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Current Promotions</h2>
          <PromotionsCarousel />
        </div>
      </div>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <OnboardingModal
          currentStep={onboardingStep}
          onNext={onNextOnboarding}
          onClose={onCloseOnboarding}
          userName={userName}
        />
      )}
    </div>
  );
};

export default Dashboard;
