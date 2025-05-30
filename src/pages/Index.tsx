
import React, { useState } from 'react';
import RegistrationForm from '@/components/RegistrationForm';
import WelcomeMessage from '@/components/WelcomeMessage';
import Dashboard from '@/components/Dashboard';

type AppState = 'registration' | 'welcome' | 'dashboard';

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

  return (
    <Dashboard
      userName={userName}
      showOnboarding={showOnboarding}
      onboardingStep={onboardingStep}
      onNextOnboarding={handleNextOnboarding}
      onCloseOnboarding={handleCloseOnboarding}
    />
  );
};

export default Index;
