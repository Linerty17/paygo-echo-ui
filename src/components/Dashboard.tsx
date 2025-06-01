
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

  const services = [
    { icon: "💳", label: "Buy PAY ID", page: "buyPayId" },
    { icon: "📺", label: "Watch", page: "watch" },
    { icon: "📊", label: "Airtime", page: "airtime" },
    { icon: "🗄️", label: "Data", page: "data" },
    { icon: "🎧", label: "Support", page: "support" },
    { icon: "🌐", label: "Group", page: "joinCommunities" },
    { icon: "💰", label: "Earn More", page: "earnMore" },
    { icon: "👤", label: "Profile", page: "profile" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Animated Header with moving text */}
      <div className="bg-red-500 text-white py-2 text-sm overflow-hidden relative">
        <div className="animate-marquee whitespace-nowrap">
          Dear User, We're currently experiencing issues with Opay bank transfers. Please use other banks for your payments.
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Animated PayGo Logo */}
        <div className="flex justify-center mb-4 overflow-hidden">
          <div className="animate-slide-logo">
            <img 
              src="/lovable-uploads/19396cc7-ffeb-4564-ba8f-a6d4eff13269.png" 
              alt="PayGo Logo"
              className="h-16 object-contain"
            />
          </div>
        </div>

        {/* Balance Card - Updated to match exact colors from screenshot */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-3xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              {userProfileImage ? (
                <img 
                  src={userProfileImage} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-white border-opacity-30"
                />
              ) : (
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
              )}
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-medium">Hi, {userName}</span>
                  <span className="text-2xl">👋</span>
                </div>
                <p className="text-sm opacity-90">Welcome back!</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Bell className="w-6 h-6 text-orange-400" />
              <button onClick={onLogout} className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                Logout
              </button>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm opacity-90 mb-2">Your Balance</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold">
                  {balanceVisible ? currentBalance : "****"}
                </span>
                <button 
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="text-white hover:text-gray-200"
                >
                  {balanceVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <p className="text-sm opacity-75 mt-1">Weekly Rewards: {weeklyRewards}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => onNavigate('upgradeAccount')}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-0 rounded-full h-12 flex items-center justify-center space-x-2"
            >
              <div className="w-6 h-6 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3" />
              </div>
              <span>Upgrade</span>
            </Button>
            <Button 
              onClick={() => onNavigate('transferToBank')}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-0 rounded-full h-12 flex items-center justify-center space-x-2"
            >
              <div className="w-6 h-6 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                <ArrowUp className="w-3 h-3" />
              </div>
              <span>Transfer</span>
            </Button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-4 gap-4">
          {services.map((service, index) => (
            <ServiceIcon
              key={index}
              icon={service.icon}
              label={service.label}
              onClick={() => onNavigate(service.page)}
            />
          ))}
        </div>

        {/* Current Promotions */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Current Promotions</h2>
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
