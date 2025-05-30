
import React, { useState } from 'react';
import { Bell, Eye, EyeOff, ArrowUp, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ServiceIcon from './ServiceIcon';
import PromotionsCarousel from './PromotionsCarousel';
import OnboardingModal from './OnboardingModal';

interface DashboardProps {
  userName: string;
  showOnboarding: boolean;
  onboardingStep: number;
  onNextOnboarding: () => void;
  onCloseOnboarding: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  userName,
  showOnboarding,
  onboardingStep,
  onNextOnboarding,
  onCloseOnboarding
}) => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const balance = "₦180,000.00";
  const weeklyRewards = "₦180,000.00";

  const services = [
    { icon: "💳", label: "Buy PAY ID" },
    { icon: "📺", label: "Watch" },
    { icon: "📊", label: "Airtime" },
    { icon: "🗄️", label: "Data" },
    { icon: "🎧", label: "Support" },
    { icon: "🌐", label: "Group" },
    { icon: "💰", label: "Earn More" },
    { icon: "👤", label: "Profile" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-500 text-white text-center py-2 text-sm">
        Dear User, We're currently experiencing issues with Opay bank transfers. Please use other banks for your payments.
      </div>

      <div className="p-4 space-y-6">
        {/* Balance Card */}
        <div className="bg-paygo-lavender rounded-3xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold">S</span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-medium">Hi, {userName}</span>
                  <span className="text-2xl">👋</span>
                </div>
                <p className="text-sm opacity-90">Welcome back!</p>
              </div>
            </div>
            <Bell className="w-6 h-6 text-orange-400" />
          </div>

          <div className="mb-6">
            <p className="text-sm opacity-90 mb-2">Your Balance</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold">
                  {balanceVisible ? balance : "****"}
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
            <Button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-0 rounded-full h-12 flex items-center justify-center space-x-2">
              <div className="w-6 h-6 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3" />
              </div>
              <span>Upgrade</span>
            </Button>
            <Button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-0 rounded-full h-12 flex items-center justify-center space-x-2">
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
              onClick={() => console.log(`Clicked ${service.label}`)}
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
