import React, { useState } from 'react';
import RegistrationForm from '@/components/RegistrationForm';
import WelcomeMessage from '@/components/WelcomeMessage';
import Dashboard from '@/components/Dashboard';
import TransferToBank from '@/components/TransferToBank';
import UpgradeAccount from '@/components/UpgradeAccount';
import JoinCommunities from '@/components/JoinCommunities';
import Support from '@/components/Support';
import Profile from '@/components/Profile';
import BuyPayId from '@/components/BuyPayId';
import Airtime from '@/components/Airtime';
import PaymentConfirmation from '@/components/PaymentConfirmation';
import BankTransferPage from '@/components/BankTransferPage';
import PreparingPayment from '@/components/PreparingPayment';
import PayIdSuccess from '@/components/PayIdSuccess';

type AppState = 'registration' | 'welcome' | 'dashboard' | 'transferToBank' | 'upgradeAccount' | 'joinCommunities' | 'support' | 'profile' | 'buyPayId' | 'airtime' | 'preparingPayment' | 'bankTransfer' | 'paymentConfirmation' | 'payIdSuccess';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('registration');
  const [userName, setUserName] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);

  const handleRegister = (name: string, email: string, password: string) => {
    console.log('Registration:', { name, email, password });
    setUserName(name);
    setAppState('welcome');
  };

  const handleContinueToDashboard = () => {
    setAppState('dashboard');
    setShowOnboarding(true);
  };

  const handleNextOnboarding = () => {
    if (onboardingStep < 5) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setShowOnboarding(false);
    }
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };

  const handleSwitchToLogin = () => {
    console.log('Switch to login');
    // For demo purposes, just proceed to welcome
    setUserName('Support');
    setAppState('welcome');
  };

  const handleNavigate = (page: string) => {
    setAppState(page as AppState);
  };

  const handleBackToDashboard = () => {
    setAppState('dashboard');
  };

  const handlePayClicked = () => {
    setAppState('preparingPayment');
  };

  const handlePreparingComplete = () => {
    setAppState('bankTransfer');
  };

  const handleTransferConfirmed = () => {
    setAppState('paymentConfirmation');
  };

  const handlePaymentComplete = () => {
    setAppState('payIdSuccess');
  };

  if (appState === 'registration') {
    return (
      <RegistrationForm 
        onRegister={handleRegister}
        onSwitchToLogin={handleSwitchToLogin}
      />
    );
  }

  if (appState === 'welcome') {
    return (
      <WelcomeMessage onContinue={handleContinueToDashboard} />
    );
  }

  if (appState === 'transferToBank') {
    return <TransferToBank onBack={handleBackToDashboard} />;
  }

  if (appState === 'upgradeAccount') {
    return <UpgradeAccount onBack={handleBackToDashboard} />;
  }

  if (appState === 'joinCommunities') {
    return <JoinCommunities onBack={handleBackToDashboard} />;
  }

  if (appState === 'support') {
    return <Support onBack={handleBackToDashboard} />;
  }

  if (appState === 'profile') {
    return <Profile onBack={handleBackToDashboard} />;
  }

  if (appState === 'buyPayId') {
    return <BuyPayId onBack={handleBackToDashboard} onPayClicked={handlePayClicked} />;
  }

  if (appState === 'airtime') {
    return <Airtime onBack={handleBackToDashboard} />;
  }

  if (appState === 'preparingPayment') {
    return <PreparingPayment onBack={handleBackToDashboard} onComplete={handlePreparingComplete} />;
  }

  if (appState === 'bankTransfer') {
    return <BankTransferPage onBack={handleBackToDashboard} onTransferConfirmed={handleTransferConfirmed} />;
  }

  if (appState === 'paymentConfirmation') {
    return <PaymentConfirmation onBack={handleBackToDashboard} onComplete={handlePaymentComplete} />;
  }

  if (appState === 'payIdSuccess') {
    return <PayIdSuccess onBack={handleBackToDashboard} />;
  }

  return (
    <Dashboard
      userName={userName}
      showOnboarding={showOnboarding}
      onboardingStep={onboardingStep}
      onNextOnboarding={handleNextOnboarding}
      onCloseOnboarding={handleCloseOnboarding}
      onNavigate={handleNavigate}
    />
  );
};

export default Index;
