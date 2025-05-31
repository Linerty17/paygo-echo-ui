import React, { useState, useEffect } from 'react';
import RegistrationForm from '@/components/RegistrationForm';
import Login from '@/components/Login';
import WelcomeMessage from '@/components/WelcomeMessage';
import Dashboard from '@/components/Dashboard';
import TransferToBank from '@/components/TransferToBank';
import UpgradeAccount from '@/components/UpgradeAccount';
import JoinCommunities from '@/components/JoinCommunities';
import Support from '@/components/Support';
import Profile from '@/components/Profile';
import BuyPayId from '@/components/BuyPayId';
import Airtime from '@/components/Airtime';
import Data from '@/components/Data';
import PaymentConfirmation from '@/components/PaymentConfirmation';
import BankTransferPage from '@/components/BankTransferPage';
import PreparingPayment from '@/components/PreparingPayment';
import PayIdSuccess from '@/components/PayIdSuccess';
import PurchaseSuccess from '@/components/PurchaseSuccess';

type AppState = 'registration' | 'login' | 'welcome' | 'dashboard' | 'transferToBank' | 'upgradeAccount' | 'joinCommunities' | 'support' | 'profile' | 'buyPayId' | 'airtime' | 'data' | 'preparingPayment' | 'bankTransfer' | 'paymentConfirmation' | 'payIdSuccess' | 'purchaseSuccess';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('registration');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [purchaseType, setPurchaseType] = useState<'airtime' | 'data'>('airtime');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [purchasePhone, setPurchasePhone] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<AppState[]>([]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      
      if (isLoggedIn && navigationHistory.length > 0) {
        // Go back to previous page in navigation history
        const previousPage = navigationHistory[navigationHistory.length - 1];
        setNavigationHistory(prev => prev.slice(0, -1));
        setAppState(previousPage);
      } else if (isLoggedIn) {
        // If no history but logged in, go to dashboard
        setAppState('dashboard');
      }
      // If not logged in, do nothing (stay on current auth page)
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isLoggedIn, navigationHistory]);

  // Update navigation history when changing pages
  const navigateToPage = (newState: AppState) => {
    if (isLoggedIn && appState !== newState) {
      setNavigationHistory(prev => [...prev, appState]);
    }
    setAppState(newState);
  };

  const handleRegister = (name: string, email: string, password: string) => {
    console.log('Registration:', { name, email, password });
    setUserName(name);
    setUserEmail(email);
    setIsLoggedIn(true);
    setAppState('welcome');
    setNavigationHistory([]);
  };

  const handleLogin = (email: string) => {
    console.log('Login:', { email });
    setUserName('Support');
    setUserEmail(email);
    setIsLoggedIn(true);
    setAppState('welcome');
    setNavigationHistory([]);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setNavigationHistory([]);
    setAppState('login');
  };

  const handleContinueToDashboard = () => {
    navigateToPage('dashboard');
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
    setAppState('login');
  };

  const handleSwitchToRegister = () => {
    setAppState('registration');
  };

  const handleNavigate = (page: string) => {
    navigateToPage(page as AppState);
  };

  const handleBackToDashboard = () => {
    if (navigationHistory.length > 0) {
      const previousPage = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      setAppState(previousPage);
    } else {
      setAppState('dashboard');
    }
  };

  const handlePayClicked = () => {
    navigateToPage('preparingPayment');
  };

  const handlePreparingComplete = () => {
    navigateToPage('bankTransfer');
  };

  const handleTransferConfirmed = () => {
    navigateToPage('paymentConfirmation');
  };

  const handlePaymentComplete = () => {
    navigateToPage('payIdSuccess');
  };

  const handleDataPurchaseSuccess = () => {
    setPurchaseType('data');
    navigateToPage('purchaseSuccess');
  };

  const handleAirtimePurchaseSuccess = (amount: string, phone: string) => {
    setPurchaseType('airtime');
    setPurchaseAmount(amount);
    setPurchasePhone(phone);
    navigateToPage('purchaseSuccess');
  };

  const handleProfileImageChange = (image: string) => {
    setUserProfileImage(image);
  };

  if (appState === 'registration') {
    return (
      <RegistrationForm 
        onRegister={handleRegister}
        onSwitchToLogin={handleSwitchToLogin}
      />
    );
  }

  if (appState === 'login') {
    return (
      <Login 
        onLogin={handleLogin}
        onSwitchToRegister={handleSwitchToRegister}
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
    return (
      <Profile 
        onBack={handleBackToDashboard} 
        userEmail={userEmail}
        profileImage={userProfileImage}
        onProfileImageChange={handleProfileImageChange}
      />
    );
  }

  if (appState === 'buyPayId') {
    return <BuyPayId onBack={handleBackToDashboard} onPayClicked={handlePayClicked} />;
  }

  if (appState === 'airtime') {
    return <Airtime onBack={handleBackToDashboard} onPurchaseSuccess={handleAirtimePurchaseSuccess} />;
  }

  if (appState === 'data') {
    return <Data onBack={handleBackToDashboard} onDataPurchaseSuccess={handleDataPurchaseSuccess} />;
  }

  if (appState === 'preparingPayment') {
    return <PreparingPayment onBack={handleBackToDashboard} onComplete={handlePreparingComplete} />;
  }

  if (appState === 'bankTransfer') {
    return <BankTransferPage onBack={handleBackToDashboard} onTransferConfirmed={handleTransferConfirmed} userEmail={userEmail} />;
  }

  if (appState === 'paymentConfirmation') {
    return <PaymentConfirmation onBack={handleBackToDashboard} onComplete={handlePaymentComplete} />;
  }

  if (appState === 'payIdSuccess') {
    return <PayIdSuccess onBack={handleBackToDashboard} />;
  }

  if (appState === 'purchaseSuccess') {
    return (
      <PurchaseSuccess 
        onBack={handleBackToDashboard} 
        type={purchaseType}
        amount={purchaseAmount}
        phoneNumber={purchasePhone}
      />
    );
  }

  return (
    <Dashboard
      userName={userName}
      userEmail={userEmail}
      userProfileImage={userProfileImage}
      showOnboarding={showOnboarding}
      onboardingStep={onboardingStep}
      onNextOnboarding={handleNextOnboarding}
      onCloseOnboarding={handleCloseOnboarding}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    />
  );
};

export default Index;
