import React, { useState, useEffect } from 'react';
import RegistrationForm from '@/components/RegistrationForm';
import Login from '@/components/Login';
import WelcomeMessage from '@/components/WelcomeMessage';
import EarnMore from '@/components/EarnMore';
import Dashboard from '@/components/Dashboard';
import TransferToBank from '@/components/TransferToBank';
import UpgradeAccount from '@/components/UpgradeAccount';
import UpgradeProcessing from '@/components/UpgradeProcessing';
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
import TransferSuccess from '@/components/TransferSuccess';
import AirtimeSuccess from '@/components/AirtimeSuccess';
import PaymentFailed from '@/components/PaymentFailed';
import LiveChat from '@/components/LiveChat';

type AppState = 'registration' | 'login' | 'welcome' | 'earnMore' | 'dashboard' | 'transferToBank' | 'upgradeAccount' | 'upgradeProcessing' | 'joinCommunities' | 'support' | 'profile' | 'buyPayId' | 'airtime' | 'data' | 'preparingPayment' | 'bankTransfer' | 'paymentConfirmation' | 'paymentFailed' | 'payIdSuccess' | 'purchaseSuccess' | 'transferSuccess' | 'airtimeSuccess';

interface User {
  name: string;
  email: string;
  password: string;
}

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
  const [transferAmount, setTransferAmount] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<AppState[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [currentBalance, setCurrentBalance] = useState(180000);
  const [selectedUpgradeLevel, setSelectedUpgradeLevel] = useState('');
  const [selectedUpgradePrice, setSelectedUpgradePrice] = useState('');

  // Load registered users from localStorage on component mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('paygo_registered_users');
    if (savedUsers) {
      setRegisteredUsers(JSON.parse(savedUsers));
    }
  }, []);

  // Handle browser back button and prevent app exit
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      
      if (isLoggedIn && navigationHistory.length > 0) {
        // Go back to previous page in navigation history
        const previousPage = navigationHistory[navigationHistory.length - 1];
        setNavigationHistory(prev => prev.slice(0, -1));
        setAppState(previousPage);
        
        // Push the current state to prevent browser exit
        window.history.pushState({ page: previousPage }, '', window.location.href);
      } else if (isLoggedIn) {
        // If no history but logged in, go to dashboard
        setAppState('dashboard');
        window.history.pushState({ page: 'dashboard' }, '', window.location.href);
      } else {
        // If not logged in, stay on auth pages and prevent exit
        if (appState === 'login') {
          setAppState('registration');
        } else {
          setAppState('login');
        }
        window.history.pushState({ page: appState }, '', window.location.href);
      }
    };

    // Push initial state to prevent immediate exit
    window.history.pushState({ page: appState }, '', window.location.href);
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isLoggedIn, navigationHistory, appState]);

  // Update navigation history when changing pages
  const navigateToPage = (newState: AppState) => {
    if (isLoggedIn && appState !== newState) {
      setNavigationHistory(prev => [...prev, appState]);
    }
    setAppState(newState);
    // Push new state to browser history
    window.history.pushState({ page: newState }, '', window.location.href);
  };

  const handleRegister = (name: string, email: string, password: string, country: string) => {
    console.log('Registration:', { name, email, password, country });
    
    // Check if user already exists
    const existingUser = registeredUsers.find(user => user.email === email);
    if (existingUser) {
      alert('User already exists with this email. Please login instead.');
      setAppState('login');
      return;
    }

    // Add new user to registered users
    const newUser: User = { name, email, password };
    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    
    // Save to localStorage
    localStorage.setItem('paygo_registered_users', JSON.stringify(updatedUsers));

    setUserName(name);
    setUserEmail(email);
    setIsLoggedIn(true);
    setAppState('welcome');
    setNavigationHistory([]);
  };

  const handleLogin = (email: string, password: string) => {
    console.log('Login:', { email, password });
    
    // Find user in registered users
    const user = registeredUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      alert('Invalid email or password. Please register first if you don\'t have an account.');
      return;
    }

    setUserName(user.name);
    setUserEmail(email);
    setIsLoggedIn(true);
    setAppState('welcome');
    setNavigationHistory([]);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setNavigationHistory([]);
    setUserName('');
    setUserEmail('');
    setUserProfileImage(null);
    setAppState('login');
  };

  const handleContinueToDashboard = () => {
    navigateToPage('dashboard');
    setShowOnboarding(true);
  };

  const handleEarnMore = () => {
    navigateToPage('earnMore');
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

  const handleUpgradePayment = (levelName: string, price: string) => {
    setSelectedUpgradeLevel(levelName);
    setSelectedUpgradePrice(price);
    navigateToPage('upgradeProcessing');
  };

  const handleUpgradeProcessingComplete = () => {
    navigateToPage('bankTransfer');
  };

  const handleTransferComplete = (amount: string) => {
    const transferValue = parseFloat(amount.replace(/[₦,]/g, ''));
    setCurrentBalance(prev => prev - transferValue);
    setTransferAmount(amount);
    navigateToPage('transferSuccess');
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
    navigateToPage('paymentFailed');
  };

  const handleTryAgainPayment = () => {
    navigateToPage('bankTransfer');
  };

  const handleDataPurchaseSuccess = () => {
    setPurchaseType('data');
    setCurrentBalance(prev => prev - parseFloat(purchaseAmount.replace(/[₦,]/g, '')));
    navigateToPage('purchaseSuccess');
  };

  const handleAirtimePurchaseSuccess = (amount: string, phone: string) => {
    const purchaseValue = parseFloat(amount.replace(/[₦,]/g, ''));
    setCurrentBalance(prev => prev - purchaseValue);
    setPurchaseType('airtime');
    setPurchaseAmount(amount);
    setPurchasePhone(phone);
    navigateToPage('airtimeSuccess');
  };

  const handleProfileImageChange = (image: string) => {
    setUserProfileImage(image);
  };

  const handleProfileUpdate = (newName: string) => {
    setUserName(newName);
    // Update in registered users as well
    const updatedUsers = registeredUsers.map(user => 
      user.email === userEmail ? { ...user, name: newName } : user
    );
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('paygo_registered_users', JSON.stringify(updatedUsers));
  };

  const formatBalance = (balance: number) => {
    return `₦${balance.toLocaleString()}.00`;
  };

  // Only show registration if no users are registered or not logged in
  if (appState === 'registration') {
    return (
      <>
        <RegistrationForm 
          onRegister={handleRegister}
          onSwitchToLogin={handleSwitchToLogin}
        />
        <LiveChat />
      </>
    );
  }

  if (appState === 'login') {
    return (
      <>
        <Login 
          onLogin={handleLogin}
          onSwitchToRegister={handleSwitchToRegister}
        />
        <LiveChat />
      </>
    );
  }

  // All other pages require authentication
  if (!isLoggedIn) {
    return (
      <>
        <Login 
          onLogin={handleLogin}
          onSwitchToRegister={handleSwitchToRegister}
        />
        <LiveChat />
      </>
    );
  }

  if (appState === 'welcome') {
    return (
      <>
        <WelcomeMessage 
          onContinue={handleContinueToDashboard} 
        />
        <LiveChat />
      </>
    );
  }

  if (appState === 'earnMore') {
    return (
      <>
        <EarnMore onBack={handleBackToDashboard} />
        <LiveChat />
      </>
    );
  }

  if (appState === 'transferToBank') {
    return (
      <>
        <TransferToBank 
          onBack={handleBackToDashboard} 
          onTransferComplete={handleTransferComplete}
          currentBalance={formatBalance(currentBalance)}
        />
        <LiveChat />
      </>
    );
  }

  if (appState === 'upgradeAccount') {
    return (
      <>
        <UpgradeAccount 
          onBack={handleBackToDashboard} 
          onProceedToPayment={handleUpgradePayment}
        />
        <LiveChat />
      </>
    );
  }

  if (appState === 'upgradeProcessing') {
    return (
      <>
        <UpgradeProcessing 
          onBack={handleBackToDashboard} 
          onComplete={handleUpgradeProcessingComplete}
          levelName={selectedUpgradeLevel}
          price={selectedUpgradePrice}
        />
        <LiveChat />
      </>
    );
  }

  if (appState === 'joinCommunities') {
    return (
      <>
        <JoinCommunities onBack={handleBackToDashboard} />
        <LiveChat />
      </>
    );
  }

  if (appState === 'support') {
    return (
      <>
        <Support onBack={handleBackToDashboard} />
        <LiveChat />
      </>
    );
  }

  if (appState === 'profile') {
    return (
      <>
        <Profile 
          onBack={handleBackToDashboard} 
          userEmail={userEmail}
          userName={userName}
          profileImage={userProfileImage}
          onProfileImageChange={handleProfileImageChange}
          onProfileUpdate={handleProfileUpdate}
        />
        <LiveChat />
      </>
    );
  }

  if (appState === 'buyPayId') {
    return (
      <>
        <BuyPayId 
          onBack={handleBackToDashboard} 
          onPayClicked={handlePayClicked}
          userName={userName}
          userEmail={userEmail}
        />
        <LiveChat />
      </>
    );
  }

  if (appState === 'airtime') {
    return (
      <>
        <Airtime 
          onBack={handleBackToDashboard} 
          onPurchaseSuccess={handleAirtimePurchaseSuccess} 
        />
        <LiveChat />
      </>
    );
  }

  if (appState === 'data') {
    return (
      <>
        <Data 
          onBack={handleBackToDashboard} 
          onDataPurchaseSuccess={handleDataPurchaseSuccess} 
        />
        <LiveChat />
      </>
    );
  }

  if (appState === 'preparingPayment') {
    return (
      <>
        <PreparingPayment onBack={handleBackToDashboard} onComplete={handlePreparingComplete} />
        <LiveChat />
      </>
    );
  }

  if (appState === 'bankTransfer') {
    return (
      <>
        <BankTransferPage 
          onBack={handleBackToDashboard} 
          onTransferConfirmed={handleTransferConfirmed} 
          userEmail={userEmail}
          amount={selectedUpgradeLevel ? selectedUpgradePrice : '₦6,500'}
          levelName={selectedUpgradeLevel || undefined}
        />
        <LiveChat />
      </>
    );
  }

  if (appState === 'paymentConfirmation') {
    return (
      <>
        <PaymentConfirmation onBack={handleBackToDashboard} onComplete={handlePaymentComplete} />
        <LiveChat />
      </>
    );
  }

  if (appState === 'paymentFailed') {
    return (
      <>
        <PaymentFailed 
          onBack={handleBackToDashboard} 
          onTryAgain={handleTryAgainPayment}
          onGoToDashboard={handleBackToDashboard}
        />
        <LiveChat />
      </>
    );
  }

  if (appState === 'payIdSuccess') {
    return (
      <>
        <PayIdSuccess onBack={handleBackToDashboard} />
        <LiveChat />
      </>
    );
  }

  if (appState === 'transferSuccess') {
    return (
      <>
        <TransferSuccess onBack={handleBackToDashboard} amount={transferAmount} />
        <LiveChat />
      </>
    );
  }

  if (appState === 'airtimeSuccess') {
    return (
      <>
        <AirtimeSuccess 
          onBack={handleBackToDashboard} 
          phoneNumber={purchasePhone}
          amount={purchaseAmount}
          network="MTN"
        />
        <LiveChat />
      </>
    );
  }

  if (appState === 'purchaseSuccess') {
    return (
      <>
        <PurchaseSuccess 
          onBack={handleBackToDashboard} 
          type={purchaseType}
          amount={purchaseAmount}
          phoneNumber={purchasePhone}
        />
        <LiveChat />
      </>
    );
  }

  return (
    <>
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
        currentBalance={formatBalance(currentBalance)}
      />
      <LiveChat />
    </>
  );
};

export default Index;
