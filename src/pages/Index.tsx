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
import Airtime from '@/components/Airtime';
import Data from '@/components/Data';
import PaymentConfirmation from '@/components/PaymentConfirmation';
import BankTransferPage from '@/components/BankTransferPage';
import PreparingPayment from '@/components/PreparingPayment';
import PayIdSuccess from '@/components/PayIdSuccess';
import PurchaseSuccess from '@/components/PurchaseSuccess';
import TransferSuccess from '@/components/TransferSuccess';
import AirtimeSuccess from '@/components/AirtimeSuccess';
import PaymentPending from '@/components/PaymentPending';
import LiveChat from '@/components/LiveChat';
import FloatingTelegramButton from '@/components/FloatingTelegramButton';
import PayIdPaymentPage from '@/components/PayIdPaymentPage';
import UpgradePaymentPage from '@/components/UpgradePaymentPage';
import PayIdPlanSelect from '@/components/PayIdPlanSelect';
import OnlinePaymentUpload from '@/components/OnlinePaymentUpload';
import PaymentUploadsAdmin from '@/components/admin/PaymentUploadsAdmin';
import { useAuth } from '@/hooks/useAuth';
import { useUserNotifications } from '@/hooks/useUserNotifications';
import { useAccountStatus } from '@/hooks/useAccountStatus';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Full-screen notification screens
import PaymentApprovedScreen from '@/components/screens/PaymentApprovedScreen';
import PaymentDeclinedScreen from '@/components/screens/PaymentDeclinedScreen';
import PayIdRevokedScreen from '@/components/screens/PayIdRevokedScreen';
import BannedScreen from '@/components/screens/BannedScreen';
import UnbannedScreen from '@/components/screens/UnbannedScreen';

type AppState = 'registration' | 'login' | 'welcome' | 'earnMore' | 'dashboard' | 'transferToBank' | 'upgradeAccount' | 'upgradeProcessing' | 'upgradePayment' | 'payIdPayment' | 'joinCommunities' | 'support' | 'profile' | 'buyPayId' | 'airtime' | 'data' | 'preparingPayment' | 'bankTransfer' | 'paymentConfirmation' | 'paymentPending' | 'payIdSuccess' | 'purchaseSuccess' | 'transferSuccess' | 'airtimeSuccess' | 'onlinePaymentUpload' | 'paymentUploadsAdmin';

const Index = () => {
  const { user, profile, profileLoading, profileError, refreshProfile, loading, signUp, signIn, signOut, updateProfile, fetchReferrals, claimWeeklyReward, isAuthenticated } = useAuth();
  
  // Real-time notifications and account status
  const { notifications, latestNotification, unreadCount, markAsRead, markAllAsRead, clearLatest } = useUserNotifications(user?.id);
  const { status: accountStatus } = useAccountStatus(user?.id);
  
  // Full-screen notification states
  const [showPaymentApproved, setShowPaymentApproved] = useState(false);
  const [showPaymentDeclined, setShowPaymentDeclined] = useState(false);
  const [showPayIdRevoked, setShowPayIdRevoked] = useState(false);
  const [showUnbanned, setShowUnbanned] = useState(false);
  const [approvedPayIdCode, setApprovedPayIdCode] = useState('');
  const [declineReason, setDeclineReason] = useState('');
  
  const [appState, setAppState] = useState<AppState>('registration');
  const [userProfileImage, setUserProfileImage] = useState<string | null>(profile?.avatar_url || null);
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
  const userName = profile?.name || (user?.user_metadata as any)?.name || user?.email?.split('@')[0] || '';
  const userEmail = profile?.email || user?.email || '';
  const currentBalance = profile?.balance ?? 0;
  const userLevel = profile?.level || 1;
  
  // Note: we don't block the whole app on profile fetch; we show a retry screen if it fails.

  // Handle real-time notifications
  useEffect(() => {
    if (latestNotification) {
      switch (latestNotification.type) {
        case 'payment_approved':
          setApprovedPayIdCode(latestNotification.metadata?.payid_code || 'PAY-4277151111');
          setShowPaymentApproved(true);
          break;
        case 'payment_declined':
          setDeclineReason(latestNotification.message);
          setShowPaymentDeclined(true);
          break;
        case 'payid_revoked':
          setShowPayIdRevoked(true);
          break;
        case 'unbanned':
          setShowUnbanned(true);
          break;
      }
      clearLatest();
    }
  }, [latestNotification, clearLatest]);

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

  // Fetch referral count on mount and load avatar
  useEffect(() => {
    if (profile) {
      fetchReferrals().then(referrals => {
        setReferralCount(referrals.length);
      });
      // Load avatar from profile
      if (profile.avatar_url) {
        setUserProfileImage(profile.avatar_url);
      }
    }
  }, [profile]);

  const handleClaimRewards = async (amount: number) => {
    if (!canClaimWeeklyReward()) return;
    
    // Use secure server-side claim function
    const result = await claimWeeklyReward();
    
    if (result.success) {
      toast({
        title: "🎉 Reward Claimed!",
        description: `You've successfully claimed ₦${result.claimed_amount?.toLocaleString()}. Next claim available in 7 days.`,
      });
    } else {
      toast({
        title: "Claim Failed",
        description: result.error || "Unable to claim reward at this time.",
        variant: "destructive"
      });
    }
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

  const handleRegister = async (name: string, email: string, password: string, country: string, phone: string, referralCode?: string) => {
    const result = await signUp(email, password, name, country, phone, referralCode);
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
    const newBalance = currentBalance - transferValue;
    
    if (newBalance < 0) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough funds for this transfer.",
        variant: "destructive"
      });
      return;
    }
    
    const { error } = await updateProfile({ balance: newBalance });
    
    if (error) {
      toast({
        title: "Transfer Failed",
        description: "Could not process your transfer. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    // Refresh profile to ensure UI shows updated balance
    await refreshProfile();
    
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
    navigateToPage('paymentPending');
  };

  const handleRefreshPayment = () => {
    // Could add logic to check payment status
    console.log('Checking payment status...');
  };

  const handleGoToDashboardDirect = () => {
    setNavigationHistory([]);
    setAppState('dashboard');
  };

  const handleDataPurchaseSuccess = async () => {
    const purchaseValue = parseFloat(purchaseAmount.replace(/[₦,]/g, ''));
    const newBalance = currentBalance - purchaseValue;
    
    if (newBalance < 0) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough funds for this purchase.",
        variant: "destructive"
      });
      return;
    }
    
    const { error } = await updateProfile({ balance: newBalance });
    
    if (error) {
      toast({
        title: "Purchase Failed",
        description: "Could not process your data purchase. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    await refreshProfile();
    setPurchaseType('data');
    navigateToPage('purchaseSuccess');
  };

  const handleAirtimePurchaseSuccess = async (amount: string, phone: string) => {
    const purchaseValue = parseFloat(amount.replace(/[₦,]/g, ''));
    const newBalance = currentBalance - purchaseValue;
    
    if (newBalance < 0) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough funds for this purchase.",
        variant: "destructive"
      });
      return;
    }
    
    const { error } = await updateProfile({ balance: newBalance });
    
    if (error) {
      toast({
        title: "Purchase Failed",
        description: "Could not process your airtime purchase. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    await refreshProfile();
    setPurchaseType('airtime');
    setPurchaseAmount(amount);
    setPurchasePhone(phone);
    navigateToPage('airtimeSuccess');
  };

  const handleProfileImageChange = async (image: string) => {
    setUserProfileImage(image);
    await updateProfile({ avatar_url: image });
  };

  const handleProfileUpdate = async (updates: { name?: string; phone?: string; country?: string }) => {
    await updateProfile(updates);
  };

  const formatBalance = (balance: number) => {
    return `₦${balance.toLocaleString()}.00`;
  };

  // Show banned screen if user is banned
  if (accountStatus === 'banned' && isAuthenticated) {
    return (
      <BannedScreen 
        onContactSupport={() => window.open('https://t.me/officialbluepay', '_blank')}
      />
    );
  }

  // Show full-screen notification overlays
  if (showPaymentApproved) {
    return (
      <PaymentApprovedScreen 
        payIdCode={approvedPayIdCode}
        onContinue={() => {
          setShowPaymentApproved(false);
          setAppState('dashboard');
        }}
      />
    );
  }

  if (showPaymentDeclined) {
    return (
      <PaymentDeclinedScreen 
        reason={declineReason}
        onRetry={() => {
          setShowPaymentDeclined(false);
          navigateToPage('buyPayId');
        }}
        onContactSupport={() => {
          setShowPaymentDeclined(false);
          navigateToPage('support');
        }}
      />
    );
  }

  if (showPayIdRevoked) {
    return (
      <PayIdRevokedScreen 
        onBuyNewPayId={() => {
          setShowPayIdRevoked(false);
          navigateToPage('buyPayId');
        }}
        onContactSupport={() => {
          setShowPayIdRevoked(false);
          navigateToPage('support');
        }}
      />
    );
  }

  if (showUnbanned) {
    return (
      <UnbannedScreen 
        onContinue={() => {
          setShowUnbanned(false);
          setAppState('dashboard');
        }}
      />
    );
  }

  // Show loading state while checking auth / account status.
  // Don't block the whole app on profile fetch (it can be slow or fail on new devices).
  if (loading || (isAuthenticated && accountStatus === 'loading')) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If auth succeeded but profile cannot be fetched/created, show a clear recovery screen.
  if (isAuthenticated && !profile && profileError && !profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-sm glass-card rounded-2xl p-4 border border-white/10 space-y-3">
          <h1 className="text-lg font-bold text-foreground">We couldn’t load your profile</h1>
          <p className="text-sm text-muted-foreground">{profileError}</p>
          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => refreshProfile()}>
              Retry
            </Button>
            <Button className="flex-1" variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
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
          userId={user?.id || ''}
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
          userPhone={profile?.phone || null}
          userCountry={profile?.country || 'NG'}
          profileImage={userProfileImage}
          onProfileImageChange={handleProfileImageChange}
          onProfileUpdate={handleProfileUpdate}
          onLogout={handleLogout}
        />
        <LiveChat />
      </>
    );
  }

  if (appState === 'buyPayId') {
    return (
      <>
        <PayIdPlanSelect 
          onBack={handleBackToDashboard} 
          onSelectOnline={() => navigateToPage('paymentPending')}
          onSelectOffline={() => navigateToPage('preparingPayment')}
          onTapToUpload={() => navigateToPage('onlinePaymentUpload')}
          userId={user?.id}
        />
        <LiveChat />
      </>
    );
  }

  if (appState === 'onlinePaymentUpload') {
    return (
      <>
        <OnlinePaymentUpload 
          onBack={handleBackToDashboard} 
          onUploadComplete={() => navigateToPage('paymentPending')}
          userId={user?.id || ''}
          userName={userName}
          userEmail={userEmail}
        />
        <LiveChat />
      </>
    );
  }

  if (appState === 'paymentUploadsAdmin') {
    return (
      <>
        <PaymentUploadsAdmin 
          onBack={handleBackToDashboard}
          onLogAudit={() => {}} // Stub for non-admin context
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

  if (appState === 'paymentPending') {
    return (
      <>
        <PaymentPending 
          onBack={handleGoToDashboardDirect} 
          onRefresh={handleRefreshPayment}
          onGoToDashboard={handleGoToDashboardDirect}
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

  // Dashboard uses notifications from the hook called at the top of the component

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
        isAdmin={profile?.is_admin || false}
        notifications={notifications}
        unreadNotificationCount={unreadCount}
        onMarkNotificationAsRead={markAsRead}
        onMarkAllNotificationsAsRead={markAllAsRead}
      />
      <FloatingTelegramButton />
      <LiveChat />
    </>
  );
};

export default Index;
