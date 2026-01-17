import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
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
import PayIdPaymentPage from '@/components/PayIdPaymentPage';
import UpgradePaymentPage from '@/components/UpgradePaymentPage';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

type AppState = 'registration' | 'login' | 'welcome' | 'earnMore' | 'dashboard' | 'transferToBank' | 'upgradeAccount' | 'upgradeProcessing' | 'upgradePayment' | 'payIdPayment' | 'joinCommunities' | 'support' | 'profile' | 'buyPayId' | 'airtime' | 'data' | 'preparingPayment' | 'bankTransfer' | 'paymentConfirmation' | 'paymentFailed' | 'payIdSuccess' | 'purchaseSuccess' | 'transferSuccess' | 'airtimeSuccess';

const Index = () => {
  const { user, profile, loading, signUp, signIn, signOut, updateProfile, fetchReferrals, isAuthenticated } = useAuth();
  
  const [appState, setAppState] = useState<AppState>('registration');
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [purchaseType, setPurchaseType] = useState<'airtime' | 'data'>('airtime');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [purchasePhone, setPurchasePhone] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [navigationHistory, setNavigationHistory] = useState<AppState[]>([]);
  const [selectedUpgradeLevel, setSelectedUpgradeLevel] = useState('');
  const [selectedUpgradePrice, setSelectedUpgradePrice] = useState('');
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [referralCount, setReferralCount] = useState(0);
  const [nextClaimTime, setNextClaimTime] = useState<Date | null>(null);

  // Get user data from profile
  const userName = profile?.name || '';
  const userEmail = profile?.email || user?.email || '';
  const currentBalance = profile?.balance || 0;
  const userLevel = profile?.level || 1;

  // Check if user can claim weekly reward
  const canClaimWeeklyReward = () => {
    if (!profile?.last_weekly_claim) return true;
    const lastClaim = new Date(profile.last_weekly_claim);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return lastClaim < oneWeekAgo;
  };

  // Calculate next claim time
  useEffect(() => {
    if (profile?.last_weekly_claim) {
      const lastClaim = new Date(profile.last_weekly_claim);
      const nextClaim = new Date(lastClaim);
      nextClaim.setDate(nextClaim.getDate() + 7);
      setNextClaimTime(nextClaim);
    } else {
      setNextClaimTime(null);
    }
  }, [profile?.last_weekly_claim]);

  // Fetch referral count on mount
  useEffect(() => {
    if (profile) {
      fetchReferrals().then(referrals => {
        setReferralCount(referrals.length);
      });
    }
  }, [profile]);

  const handleClaimRewards = async (amount: number) => {
    if (!canClaimWeeklyReward()) return;
    await updateProfile({ 
      balance: currentBalance + amount,
      last_weekly_claim: new Date().toISOString()
    });
    toast({
      title: "🎉 Reward Claimed!",
      description: `You've successfully claimed ₦${amount.toLocaleString()}. Next claim available in 7 days.`,
    });
  };

  // Handle browser back button and prevent app exit
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      
      if (isAuthenticated && navigationHistory.length > 0) {
        const previousPage = navigationHistory[navigationHistory.length - 1];
        setNavigationHistory(prev => prev.slice(0, -1));
        setAppState(previousPage);
        window.history.pushState({ page: previousPage }, '', window.location.href);
      } else if (isAuthenticated) {
        setAppState('dashboard');
        window.history.pushState({ page: 'dashboard' }, '', window.location.href);
      } else {
        if (appState === 'login') {
          setAppState('registration');
        } else {
          setAppState('login');
        }
        window.history.pushState({ page: appState }, '', window.location.href);
      }
    };

    window.history.pushState({ page: appState }, '', window.location.href);
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated, navigationHistory, appState]);

  // Update app state when authentication changes - go to dashboard on refresh, welcome only on first login
  useEffect(() => {
    if (!loading && isAuthenticated && (appState === 'registration' || appState === 'login')) {
      // Check if this is a page refresh (session was restored) or a fresh login
      if (isFirstLogin) {
        setAppState('welcome');
        setIsFirstLogin(false);
      } else {
        // Session was restored from refresh - go directly to dashboard
        setAppState('dashboard');
      }
    }
  }, [isAuthenticated, loading, appState, isFirstLogin]);

  const navigateToPage = (newState: AppState) => {
    if (isAuthenticated && appState !== newState) {
      setNavigationHistory(prev => [...prev, appState]);
    }
    setAppState(newState);
    window.history.pushState({ page: newState }, '', window.location.href);
  };

  const handleRegister = async (name: string, email: string, password: string, country: string, referralCode?: string) => {
    const result = await signUp(email, password, name, country, referralCode);
    if (!result.error) {
      setIsFirstLogin(true);
      setAppState('welcome');
      setNavigationHistory([]);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const result = await signIn(email, password);
    if (!result.error) {
      setIsFirstLogin(true);
      setAppState('welcome');
      setNavigationHistory([]);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setNavigationHistory([]);
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
    navigateToPage('upgradePayment');
  };

  const handlePayIdProcessingComplete = () => {
    navigateToPage('payIdPayment');
  };

  const handleTransferComplete = async (amount: string) => {
    const transferValue = parseFloat(amount.replace(/[₦,]/g, ''));
    await updateProfile({ balance: currentBalance - transferValue });
    setTransferAmount(amount);
    navigateToPage('transferSuccess');
  };

  const handlePayClicked = () => {
    navigateToPage('preparingPayment');
  };

  const handlePreparingComplete = () => {
    navigateToPage('payIdPayment');
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

  const handleDataPurchaseSuccess = async () => {
    const purchaseValue = parseFloat(purchaseAmount.replace(/[₦,]/g, ''));
    await updateProfile({ balance: currentBalance - purchaseValue });
    setPurchaseType('data');
    navigateToPage('purchaseSuccess');
  };

  const handleAirtimePurchaseSuccess = async (amount: string, phone: string) => {
    const purchaseValue = parseFloat(amount.replace(/[₦,]/g, ''));
    await updateProfile({ balance: currentBalance - purchaseValue });
    setPurchaseType('airtime');
    setPurchaseAmount(amount);
    setPurchasePhone(phone);
    navigateToPage('airtimeSuccess');
  };

  const handleProfileImageChange = (image: string) => {
    setUserProfileImage(image);
  };

  const handleProfileUpdate = async (newName: string) => {
    await updateProfile({ name: newName });
  };

  const formatBalance = (balance: number) => {
    return `₦${balance.toLocaleString()}.00`;
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Only show registration if not authenticated
  if (appState === 'registration' && !isAuthenticated) {
    return (
      <>
        <RegistrationForm 
          onRegister={handleRegister}
          onSwitchToLogin={handleSwitchToLogin}
          isLoading={loading}
        />
        <LiveChat />
      </>
    );
  }

  if (appState === 'login' && !isAuthenticated) {
    return (
      <>
        <Login 
          onLogin={handleLogin}
          onSwitchToRegister={handleSwitchToRegister}
          isLoading={loading}
        />
        <LiveChat />
      </>
    );
  }

  // All other pages require authentication
  if (!isAuthenticated) {
    return (
      <>
        <Login 
          onLogin={handleLogin}
          onSwitchToRegister={handleSwitchToRegister}
          isLoading={loading}
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
        <EarnMore 
          onBack={handleBackToDashboard} 
          referralCode={profile?.referral_code || null}
          fetchReferrals={fetchReferrals}
        />
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

  if (appState === 'upgradePayment') {
    return (
      <>
        <UpgradePaymentPage 
          onBack={handleBackToDashboard} 
          onTransferConfirmed={handleTransferConfirmed}
          userEmail={userEmail}
          amount={selectedUpgradePrice}
          levelName={selectedUpgradeLevel}
        />
        <LiveChat />
      </>
    );
  }

  if (appState === 'payIdPayment') {
    return (
      <>
        <PayIdPaymentPage 
          onBack={handleBackToDashboard} 
          onTransferConfirmed={handleTransferConfirmed}
          userEmail={userEmail}
          userName={userName}
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
        referralCount={referralCount}
        userLevel={userLevel}
        onClaimRewards={handleClaimRewards}
        canClaimWeeklyReward={canClaimWeeklyReward()}
        nextClaimTime={nextClaimTime}
        onProfileImageChange={handleProfileImageChange}
      />
      <LiveChat />
    </>
  );
};

export default Index;
