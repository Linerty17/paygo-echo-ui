
import React from 'react';
import { Button } from '@/components/ui/button';

interface WelcomeMessageProps {
  onContinue: () => void;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ onContinue }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        {/* PayGo Logo */}
        <div className="flex justify-center mb-12">
          <img 
            src="/lovable-uploads/b28d1274-d692-42c9-81b7-61ae377c5939.png" 
            alt="PayGo Digital Logo" 
            className="w-48 h-24 object-contain"
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-purple-900 mb-6">Welcome to PayGo!</h1>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-700 text-lg leading-relaxed">
              As a new user, you'll receive a generous welcome bonus of 
              <span className="font-bold text-purple-600"> ₦180,000</span>, which can 
              be withdrawn at any time. Yes, you read that right - it's yours to keep!
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={onContinue}
              className="w-full h-14 bg-paygo-main hover:opacity-90 text-white text-lg font-medium rounded-xl transition-all duration-300 shadow-lg"
            >
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;
