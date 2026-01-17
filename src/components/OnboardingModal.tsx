
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Gift, CreditCard, Phone, Wallet, Zap } from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface OnboardingModalProps {
  currentStep: number;
  onNext: () => void;
  onClose: () => void;
  userName: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Welcome Bonus",
    description: "You've received a welcome bonus of ₦180,000! This amount is already in your account and can be withdrawn after purchasing a PAY ID.",
    icon: <Gift className="w-8 h-8 text-primary" />
  },
  {
    id: 2,
    title: "Get Your PAY ID",
    description: "To withdraw funds, you'll need to purchase a PAY ID for ₦6,500. This is a one-time purchase that unlocks all features of the app.",
    icon: <CreditCard className="w-8 h-8 text-blue-400" />
  },
  {
    id: 3,
    title: "Airtime & Data",
    description: "You can purchase airtime and data for all major networks directly from the app. Simply select the service, enter the phone number, choose your plan, and complete your purchase.",
    icon: <Phone className="w-8 h-8 text-green-400" />
  },
  {
    id: 4,
    title: "Withdrawal Process",
    description: "To withdraw your funds, tap the \"Withdraw\" button on your dashboard, enter your bank details and PAY ID, and submit your request. Withdrawals are processed within 24 hours.",
    icon: <Wallet className="w-8 h-8 text-red-400" />
  },
  {
    id: 5,
    title: "Earn More",
    description: "Explore our app to discover ways to earn more! Refer friends to earn ₦500 per referral, join our communities, and take advantage of special promotions.",
    icon: <Zap className="w-8 h-8 text-orange-400" />
  }
];

const OnboardingModal: React.FC<OnboardingModalProps> = ({ 
  currentStep, 
  onNext, 
  onClose, 
  userName 
}) => {
  const step = onboardingSteps[currentStep - 1];
  const isLastStep = currentStep === onboardingSteps.length;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="glass-card rounded-2xl w-full max-w-md animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="shiny-gradient p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-foreground hover:text-primary"
          >
            <X className="w-6 h-6" />
          </button>
          
          <h2 className="text-xl font-bold text-foreground mb-2">Welcome to PayGo, {userName}!</h2>
          <p className="text-sm text-muted-foreground">Step {currentStep} of {onboardingSteps.length}</p>
          
          {/* Progress Bar */}
          <div className="flex space-x-1 mt-4">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-all ${
                  index < currentStep ? 'bg-primary' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="w-16 h-16 glass rounded-full flex items-center justify-center mx-auto mb-4">
            {step.icon}
          </div>
          
          <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">{step.description}</p>

          {currentStep === 5 && (
            <div className="flex justify-center space-x-4 mb-6">
              <div className="text-center">
                <div className="w-12 h-12 glass rounded-full flex items-center justify-center mx-auto mb-2">
                  <div className="w-6 h-6 bg-pink-500/50 rounded-full"></div>
                </div>
                <span className="text-sm text-muted-foreground">Communities</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 glass rounded-full flex items-center justify-center mx-auto mb-2">
                  <div className="w-6 h-6 bg-green-500/50 rounded-full flex items-center justify-center text-white text-xs">?</div>
                </div>
                <span className="text-sm text-muted-foreground">Support</span>
              </div>
            </div>
          )}

          <Button
            onClick={onNext}
            className="w-full h-12 bg-primary hover:bg-primary/80 text-primary-foreground font-medium rounded-xl transition-all duration-300 lavender-glow"
          >
            {isLastStep ? 'Get Started' : 'Next'} →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
